import { protect } from "../middlewares/authMiddleware.js";
import { prisma } from "../configs/prisma.js";
import imagekit from "../configs/imagekit.js";
import fs from "fs";
import Stripe from "stripe";
import { z } from "zod";

const listingSchema = z.object({
  title: z.string().min(3),
  platform: z.string(),
  username: z.string().optional(),
  followers_count: z.number().min(0),
  engagement_rate: z.number().optional(),
  monthly_views: z.number().optional(),
  niche: z.string(),
  price: z.number().positive(),
  description: z.string().optional(),
  country: z.string().optional(),
  age_range: z.string(),
});

export const addListings = async (req, res) => {
  try {
    const { userId } = req.auth;
    if (req.plan !== "premium") {
      const listingcount = await prisma.listing.count({
        where: { ownerId: userId },
      });
      if (listingcount >= 5) {
        return res.status(400).json({
          message: "you have reached free listing limit",
        });
      }
    }

    const accountDetails = JSON.parse(req.body.accountDetails);

    // Parse numeric fields for validation
    accountDetails.followers_count = parseFloat(accountDetails.followers_count);
    accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
    accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
    accountDetails.price = parseFloat(accountDetails.price);
    accountDetails.platform = accountDetails.platform.toLowerCase();
    accountDetails.niche = accountDetails.niche.toLowerCase();

    // Validate with Zod
    const validatedData = listingSchema.parse(accountDetails);

    if (validatedData.username?.startsWith("@")) {
      validatedData.username = validatedData.username.slice(1);
    }

    const uploadImages = req.files.map(async (file) => {
      const response = await imagekit.files.upload({
        file: fs.createReadStream(file.path),
        fileName: `${Date.now()}.png`,
        folder: "socialBazar",
        transformation: { pre: "w-1280 , h-auto" },
      });
      return response.url;
    });

    // Wait for all upload to complete
    const images = await Promise.all(uploadImages);
    const listing = await prisma.listing.create({
      data: {
        ...validatedData,
        ownerId: userId,
        images,
      },
    });
    return res.status(201).json({
      message: "Account Listed successfully",
      listing,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: error.errors,
      });
    }
    return res.status(500).json({
      message: "Error while uploading account detials",
    });
  }
};

// constroller to get all public listing
export const getAllpubliclisting = async (req, res) => {
  try {
    const listing = await prisma.listing.findMany({
      where: {
        status: "active",
      },
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    });

    if (!listing || listing.length === 0) {
      return res.json({ listings: [] });
    }

    return res.json({ listings: listing });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while uploading account detials",
    });
  }
};

//Constroller for getting all user listing
export const getAlluserlisting = async (req, res) => {
  try {
    const { userId } = req.auth;
    const listing = await prisma.listing.findMany({
      where: { ownerId: userId, status: { not: "deleted" } },
      orderBy: { createdAt: "desc" },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const balance = {
      earned: user.earned,
      withdrawn: user.withdrawn,
      available: user.earned - user.withdrawn,
    };

    return res.json({ listings: listing, balance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// constroller for updating listing in database
export const updateListing = async (req, res) => {
  try {
    const { userId } = req.auth;
    const accountDetails = JSON.parse(req.body.accountDetails);

    if (req.files.length + accountDetails.images.length > 5) {
      return res.status(400).json({ message: "YOu can only upload 5 images" });
    }

    accountDetails.followers_count = parseFloat(accountDetails.followers_count);
    accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
    accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
    accountDetails.price = parseFloat(accountDetails.price);
    accountDetails.platform = accountDetails.platform.toLowerCase();
    accountDetails.niche = accountDetails.niche.toLowerCase();

    accountDetails.username.startsWith("@")
      ? (accountDetails.username = accountDetails.username.slice(1))
      : null;

    const {
      id: listingId,
      ownerId: currentOwnerId,
      images: existingImages,
      ...updateData
    } = accountDetails;

    const listing = await prisma.listing.update({
      where: { id: listingId, ownerId: userId },
      data: updateData,
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.status === "sold") {
      return res.status(404).json({ message: "You can't update sold listing" });
    }

    if (req.files.length > 0) {
      const uploadImages = req.files.map(async (file) => {
        const response = await imagekit.files.upload({
          file: fs.createReadStream(file.path),
          fileName: `${Date.now()}.png`,
          folder: "socialBazar",
          transformation: { pre: "w-1280 , h-auto" },
        });
        return response.url;
      });
      const images = await Promise.all(uploadImages);

      const updatedListing = await prisma.listing.update({
        where: { id: listingId, ownerId: userId },
        data: {
          ...updateData,
          ownerId: userId,
          images: [...existingImages, ...images],
        },
      });
      return res.json({
        message: "Account updated successfully",
        listing: updatedListing,
      });
    }
    return res.json({ message: "Account updated successfully", listing });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const listing = await prisma.listing.findUnique({
      where: { id, ownerId: userId },
    });
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    if (listing.status === "active" || listing.status == "inactive") {
      await prisma.listing.update({
        where: { id, ownerId: userId },
        data: { status: listing.status === "active" ? "inactive" : "active" },
      });
    } else if (listing.status === "ban") {
      return res.status(400).json({ message: "Your listing is banned" });
    } else if (listing.status === "sold") {
      return res.status(400).json({ message: "Your listing is sold" });
    }

    const updated = await prisma.listing.findUnique({ where: { id } });
    return res.json({
      message: "listing status updated successfully ",
      listing: updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteuserlisting = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { listingId } = req.params;
    const listing = await prisma.listing.findFirst({
      where: { id: listingId, ownerId: userId },
      include: { owner: true },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not foound" });
    }
    if (listing.status === "sold") {
      return res
        .status(404)
        .json({ message: "Sold listing acnnot be deleted" });
    }
    // If password has been changed
    if (listing.isCredentialChanged) {
      //send email to owner
    }

    await prisma.listing.update({
      where: { id: listingId, ownerId: userId },
      data: { status: "deleted" },
    });

    return res.json({ message: "listing deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addCredential = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { listingId, credential } = req.body;

    if (credential.length === 0 || !listingId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, ownerId: userId },
    });

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found or you are not the owner",
      });
    }

    await prisma.credential.create({
      data: {
        listingId,
        originalCredential: credential,
      },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: { isCredentialSubmitted: true },
    });

    return res.json({ message: "Credential Changed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const markedFeatured = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;
    if (req.plan !== "premium") {
      return res.status(400).json({ message: "Premium plan required" });
    }

    // Unset all other listing
    await prisma.listing.updateMany({
      where: { ownerId: userId },
      data: { featured: false },
    });

    // mark the listing as fetured
    await prisma.listing.update({
      where: { id },
      data: { featured: true },
    });

    return res.json({ message: "Listing marked as featured" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const { userId } = req.auth;
    let orders = await prisma.transaction.findMany({
      where: { userId, isPaid: true },
      include: { listing: true },
    });

    if (!orders || orders.length === 0) {
      return res.json({ orders: [] });
    }

    //Attch the credential
    const credential = await prisma.credential.findMany({
      where: { listingId: { in: orders.map((order) => order.listingId) } },
    });

    const ordersWithCredentials = orders.map((order) => {
      const cred = credential.find((c) => c.listingId === order.listingId);
      return { ...order, credential: cred };
    });

    return res.json({ orders: ordersWithCredentials });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const WithdrawAmount = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { amount, account } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const balance = user.earned - user.withdrawn;

    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        account,
      },
    });

    return res.json({ message: "Applied for withdrawal", withdrawal });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const purchaseAccount = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.ownerId === userId) {
      return res
        .status(400)
        .json({ message: "You cannot purchase your own listing" });
    }

    if (listing.status !== "active") {
      return res.status(400).json({ message: "Listing is no longer active" });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        listingId: id,
        ownerId: listing.ownerId,
        userId: userId,
        amount: listing.price,
        // isPaid: true,
      },
    });

    const origin = process.env.FRONTEND_URL || "http://localhost:5173";
    const stripeinstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get user details for pre-filling checkout
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const session = await stripeinstance.checkout.sessions.create({
      automatic_payment_methods: { enabled: true },
      customer_email: user?.email,
      success_url: `${origin}/Myorders?success=true`,
      cancel_url: `${origin}/Marketplace?canceled=true`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Purchasing account @${listing.username} of ${listing.platform}`,
              description: `Secure transaction for social media asset: ${listing.title}`,
              images: listing.images?.length > 0 ? [listing.images[0]] : [],
            },
            unit_amount: Math.round(Number(transaction.amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        transactionId: transaction.id,
        listingId: id,
        buyerId: userId,
        appId: "Socialbazar",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    // // Update listing status from active to pending to reserve it?
    // // For now, we'll wait for the webhook to mark as sold.
    // await prisma.listing.update({
    //   where: { id },
    //   data: { status: "pending" },
    // });

    // return res.json({ message: "Account purchased successfully", transaction });
    return res.json({ paymentLink: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    let favorites = user.favorites || [];

    if (favorites.includes(id)) {
      favorites = favorites.filter((fav) => fav !== id);
    } else {
      favorites.push(id);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { favorites },
    });

    return res.json({ message: "Wishlist updated", favorites });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const listings = await prisma.listing.findMany({
      where: { id: { in: user.favorites } },
      include: { owner: true },
    });

    return res.json({ listings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

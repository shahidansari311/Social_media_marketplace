import { prisma } from "../configs/prisma.js";

export const getDashboardData = async (req, res) => {
  try {
    const totalListings = await prisma.listing.count();
    const activeListings = await prisma.listing.count({
      where: { status: "active" },
    });
    const totalUser = await prisma.user.count();

    // Sum total revenue from transactions
    const transactions = await prisma.transaction.findMany({
      where: { isPaid: true },
    });
    const totalRevenue = transactions.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    const recentListings = await prisma.listing.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { owner: true },
    });

    res.json({
      totalListings,
      totalRevenue,
      activeListings,
      totalUser,
      recentListings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: true },
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const listing = await prisma.listing.update({
      where: { id },
      data: { status },
    });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: { listing: true },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isWithdrawn } = req.body;

    const withdrawal = await prisma.withdrawal.update({
      where: { id },
      data: { isWithdrawn },
    });

    // If it's withdrawn, we might want to update the user's withdrawn total
    if (isWithdrawn) {
      await prisma.user.update({
        where: { id: withdrawal.userId },
        data: {
          withdrawn: {
            increment: withdrawal.amount,
          },
        },
      });
    }

    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCredentialRequests = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        OR: [{ isCredentialSubmitted: true }, { isCredentialVerified: true }],
      },
      orderBy: { updatedAt: "desc" },
      include: { owner: true },
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const listing = await prisma.listing.update({
      where: { id },
      data: { isCredentialVerified: verified },
    });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { credentials } = req.body;

    await prisma.credential.updateMany({
      where: { listingId: id },
      data: { updatedCredential: credentials },
    });

    const listing = await prisma.listing.update({
      where: { id },
      data: { isCredentialChanged: true },
    });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    const credentials = await prisma.credential.findFirst({
      where: { listingId: id },
    });
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

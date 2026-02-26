import Stripe from "stripe";
import { prisma } from "../configs/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const { transactionId } = session.metadata;

      if (transactionId) {
        try {
          // Update transaction
          const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: { isPaid: true },
            include: { listing: true },
          });

          // Update listing status
          await prisma.listing.update({
            where: { id: transaction.listingId },
            data: { status: "sold" },
          });

          // Update owner balance
          await prisma.user.update({
            where: { id: transaction.ownerId },
            data: {
              earned: { increment: transaction.amount },
            },
          });

          console.log(`Transaction ${transactionId} processed successfully.`);
        } catch (error) {
          console.error("Error updating transaction/listing:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      }
      break;

    // Add other cases as needed (e.g., checkout.session.expired)
    case "checkout.session.expired":
      // Reset listing status if it was set to pending
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

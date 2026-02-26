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
    case "checkout.session.completed": {
      const session = event.data.object;
      const { transactionId, appId } = session.metadata;

      // Only process transactions for this specific app
      if (appId !== "Socialbazar" || !transactionId) {
        return res.json({ received: true, ignored: true });
      }

      if (session.payment_status !== "paid") {
        console.log(`Session ${session.id} not paid yet.`);
        return res.json({ received: true });
      }

      try {
        // Find the transaction first to ensure it exists
        const existingTx = await prisma.transaction.findUnique({
          where: { id: transactionId },
          include: { listing: true },
        });

        if (!existingTx) {
          console.error(`Transaction ${transactionId} not found.`);
          return res.status(404).json({ message: "Transaction not found" });
        }

        if (existingTx.isPaid) {
          console.log(`Transaction ${transactionId} already processed.`);
          return res.json({ received: true });
        }

        // Update transaction, listing, and owner balance in a transaction for atomicity
        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: transactionId },
            data: { isPaid: true },
          }),
          prisma.listing.update({
            where: { id: existingTx.listingId },
            data: { status: "sold" },
          }),
          prisma.user.update({
            where: { id: existingTx.ownerId },
            data: {
              earned: { increment: existingTx.amount },
            },
          }),
        ]);

        console.log(`Transaction ${transactionId} processed successfully.`);
      } catch (error) {
        console.error("Error processing successful payment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    }

    // Add other cases as needed (e.g., checkout.session.expired)
    case "checkout.session.expired":
      // Reset listing status if it was set to pending
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

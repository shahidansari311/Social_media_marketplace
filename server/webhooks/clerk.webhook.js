import { Webhook } from "svix";
import { inngest } from "../inngest/index.js";

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET in .env");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  // Get Svix headers
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  // Verify the webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const { type, data } = evt;

  // Send to Inngest to handle background synchronization
  try {
    await inngest.send({
      name: `clerk/${type}`,
      data: data,
    });
    console.log(`Clerk event ${type} sent to Inngest`);
    return res.status(200).json({ message: "Event received and queued" });
  } catch (err) {
    console.error("Error sending event to Inngest:", err.message);
    return res.status(500).json({ error: "Failed to process event" });
  }
};

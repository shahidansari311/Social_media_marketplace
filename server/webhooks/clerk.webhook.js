const { Webhook } = require("svix");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const clerkWebhook = async (req, res) => {
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
  console.log("Clerk webhook event:", type);

  // Handle user.created event
  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, username } = data;

    const email = email_addresses?.[0]?.email_address;

    try {
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email,
          firstName: first_name || "",
          lastName: last_name || "",
          username: username || email.split("@")[0],
          imageUrl: image_url || "",
        },
      });

      console.log("User saved to DB:", user.id);
      return res.status(200).json({ message: "User created", user });
    } catch (err) {
      console.error("DB error saving user:", err.message);
      return res.status(500).json({ error: "Failed to save user to DB" });
    }
  }

  // Handle user.updated event
  if (type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, username } = data;
    const email = email_addresses?.[0]?.email_address;

    try {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email,
          firstName: first_name || "",
          lastName: last_name || "",
          username: username || email.split("@")[0],
          imageUrl: image_url || "",
        },
      });

      return res.status(200).json({ message: "User updated" });
    } catch (err) {
      console.error("DB error updating user:", err.message);
      return res.status(500).json({ error: "Failed to update user in DB" });
    }
  }

  // Handle user.deleted event
  if (type === "user.deleted") {
    const { id } = data;

    try {
      await prisma.user.delete({ where: { clerkId: id } });
      return res.status(200).json({ message: "User deleted" });
    } catch (err) {
      console.error("DB error deleting user:", err.message);
      return res.status(500).json({ error: "Failed to delete user from DB" });
    }
  }

  return res.status(200).json({ message: "Event received" });
};

module.exports = { clerkWebhook };
import { clerkClient } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const { userId, has } = req.auth;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const hasPremium = has({
      plan: "premium",
    });
    req.plan = hasPremium ? "premium" : "free";
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: error.code || error.message,
    });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);

    const isAdmin = process.env.ADMIN_EMAIL.split(",").includes(
      user.emailAddresses[0].emailAddress,
    );

    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: error.code || error.message,
    });
  }
};

import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
  getDashboardData,
  getAllListings,
  updateListingStatus,
  getAllTransactions,
  getAllWithdrawals,
  updateWithdrawalStatus,
  getCredentialRequests,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(protectAdmin);

adminRouter.get("/dashboard", getDashboardData);
adminRouter.get("/listings", getAllListings);
adminRouter.post("/listing-status/:id", updateListingStatus);
adminRouter.get("/transactions", getAllTransactions);
adminRouter.get("/withdrawals", getAllWithdrawals);
adminRouter.post("/withdrawal-status/:id", updateWithdrawalStatus);
adminRouter.get("/credential-requests", getCredentialRequests);

export default adminRouter;

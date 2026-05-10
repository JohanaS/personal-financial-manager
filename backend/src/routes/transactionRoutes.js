import express from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/transactions", createTransaction);
router.get("/transactions/user/:id", getTransactions);

export default router;
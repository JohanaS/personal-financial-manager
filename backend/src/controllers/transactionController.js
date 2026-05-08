import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { user, type, amount, category } = req.body;

    const transaction = new Transaction({
      user,
      type,
      amount,
      category
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
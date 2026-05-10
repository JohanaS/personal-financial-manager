import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { user, type, amount, category, paymentMethod, note, cardName, budgetTag } = req.body;

    const transaction = new Transaction({
      user,
      type,
      amount,
      category,
      paymentMethod,
      note,
      cardName,
      budgetTag
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await Transaction.find({ user: id}).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
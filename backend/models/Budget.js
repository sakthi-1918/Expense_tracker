const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

const BudgetSchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true },
  totalBudget: { type: Number, required: true },
  remainingBudget: { type: Number, required: true },
  expenses: [ExpenseSchema],
});

module.exports = mongoose.model("Budget", BudgetSchema);

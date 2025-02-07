const express = require("express");
const Budget = require("../models/Budget");
const router = express.Router();

// Set monthly budget
router.post("/set-budget", async (req, res) => {
  const { month, totalBudget } = req.body;
  try {
    let budget = await Budget.findOne({ month });

    if (!budget) {
      budget = new Budget({ month, totalBudget, remainingBudget: totalBudget, expenses: [] });
    } else {
      budget.totalBudget = totalBudget;
      budget.remainingBudget = totalBudget - budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get budget details
router.get("/:month", async (req, res) => {
  const { month } = req.params;
  try {
    const budget = await Budget.findOne({ month });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add an expense
router.post("/add-expense", async (req, res) => {
  const { month, description, amount } = req.body;
  try {
    const budget = await Budget.findOne({ month });

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const newExpense = { description, amount, date: new Date() };
    budget.expenses.push(newExpense);
    budget.remainingBudget -= amount;

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit an expense
router.put("/edit-expense/:month/:expenseId", async (req, res) => {
  const { month, expenseId } = req.params;
  const { description, amount } = req.body;
  try {
    const budget = await Budget.findOne({ month });

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const expense = budget.expenses.find((exp) => exp._id.toString() === expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.description = description;
    expense.amount = amount;
    budget.remainingBudget = budget.totalBudget - budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense
router.delete("/delete-expense/:month/:expenseId", async (req, res) => {
  try {
    const { month, expenseId } = req.params;
    const budget = await Budget.findOne({ month });

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const expenseToRemove = budget.expenses.find((exp) => exp._id.toString() === expenseId);
    if (!expenseToRemove) return res.status(404).json({ message: "Expense not found" });

    budget.expenses = budget.expenses.filter((exp) => exp._id.toString() !== expenseId);
    budget.remainingBudget += expenseToRemove.amount;

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

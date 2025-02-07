import React, { useState, useEffect } from "react";
import axios from "axios";
import BudgetTracker from "./components/BudgetTracker";  // Importing BudgetTracker component
import './App.css'

const App = () => {
  const [month, setMonth] = useState("");
  const [totalBudget, setTotalBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (month) fetchBudget();
  }, [month]);

  const fetchBudget = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/budget/${month}`);
      setTotalBudget(res.data.totalBudget);
      setRemainingBudget(res.data.remainingBudget);
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/budget/set-budget", { month, totalBudget });
      setRemainingBudget(res.data.remainingBudget);
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Budget Tracker</h1>
      <form onSubmit={handleSetBudget} className="form">
        <input
          type="text"
          placeholder="Enter Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Total Budget"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          required
        />
        <button type="submit">Set Budget</button>
      </form>

      <h2>Total Budget: ${totalBudget}</h2>
      <h2>Remaining: ${remainingBudget}</h2>

      <BudgetTracker
        month={month}
        expenses={expenses}
        setExpenses={setExpenses}
        setRemainingBudget={setRemainingBudget}
      />
    </div>
  );
};

export default App;

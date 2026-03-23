"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { Expense } from "../types/expense";
import { Card } from "@/components/ui/card";

type Props = {
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
};

export default function ExpenseForm({ setExpenses }: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const handleAddExpense = () => {
    if (amount === "") return;

    const newExpense: Expense = {
      id: Date.now(),
      amount: Number(amount),
      category,
      note,
      date: new Date().toISOString().slice(0, 10),
    };
    setExpenses((prev: Expense[]) => [...prev, newExpense]);

    // reset form
    setAmount("");
    setNote("");
  };

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-4">Add Expenses</h2>
      <section className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-end">
        <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-initial sm:w-auto">
          <label className="text-sm font-medium">Amount</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-initial sm:w-auto">
          <label className="text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Select category</option>
            <option value="Petrol">Petrol</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Electricity">Electricity</option>
            <option value="Milk">Milk</option>
            <option value="hotel">Hotel</option>
            <option value="Employee salary">Employee salary</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-initial sm:min-w-48">
          <label className="text-sm font-medium">Note</label>
          <input
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <button
          onClick={handleAddExpense}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium w-full sm:w-auto"
        >
          Add Expense
        </button>
      </section>
    </Card>
  );
}
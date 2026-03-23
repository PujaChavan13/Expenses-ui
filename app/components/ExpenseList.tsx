"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { Expense } from "../types/expense";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
  "Petrol", "Food", "Shopping", "Electricity", "Milk",
  "hotel", "Employee salary", "Other",
];

type Props = {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
};

export default function ExpenseList({ expenses, setExpenses }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState<number | "">("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount);
    setEditCategory(expense.category);
    setEditNote(expense.note || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditCategory("");
    setEditNote("");
  };

  const saveEdit = () => {
    if (editingId === null || editAmount === "") return;
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === editingId
          ? {
              ...e,
              amount: Number(editAmount),
              category: editCategory,
              note: editNote,
            }
          : e
      )
    );
    cancelEdit();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (expenses.length === 0) {
    return (
      <Card className="mb-4 sm:mb-6 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">Expense List</h2>
        <p className="text-muted-foreground text-sm sm:text-base">No expenses added yet.</p>
      </Card>
    );
  }

  return (
    <Card className="mb-4 sm:mb-6 p-4 sm:p-6 overflow-x-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-4">Expense List</h2>
      <ul className="space-y-2 min-w-0">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="py-3 border-b border-gray-100 last:border-0"
          >
            {editingId === expense.id ? (
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end">
                <div className="flex flex-col gap-1 sm:w-24">
                  <label className="text-xs font-medium text-muted-foreground">Amount</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) =>
                      setEditAmount(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-1 sm:w-36">
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <label className="text-xs font-medium text-muted-foreground">Note</label>
                  <input
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Note"
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
                <div className="flex justify-between sm:block gap-2">
                  <span className="font-medium sm:w-20">{expense.amount}</span>
                  <span className="sm:w-32">{expense.category}</span>
                </div>
                <span className="text-muted-foreground text-sm truncate flex-1 min-w-0">
                  {expense.note || "-"}
                </span>
                <div className="flex gap-2 mt-2 sm:mt-0 shrink-0">
                  <button
                    onClick={() => startEdit(expense)}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
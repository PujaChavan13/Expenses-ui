"use client";
import{Expense} from "../types/expense";
 
type Props={
    expenses:Expense[];
}

export default function ExpenseList({expenses}:Props){
    if(expenses.length===0){
        return <p>No expenses added yet.</p>
    }

    return(
        <section>
            <ul>
                {expenses.map((expenses)=>(
                    <li key={expenses.id}>
                        <span>{expenses.amount}</span>{""}
                        <span>{expenses.category}</span>{""}
                        <span>{expenses.note}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}
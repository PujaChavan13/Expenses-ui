"use client";
import {Expense} from "../types/expense";

type Props={
    expenses:Expense[];
    month:string;
}
export default function MonthlySummary({expenses,month}:Props){
    //Fiter expenses for the selected month
    const monthlyExpenses=expenses.filter(
        (expense)=>expense.date.startsWith(month)
    );

    //Total monthly expenses
    const totalMonthlyExpenses=monthlyExpenses.reduce(
        (sum,expense)=>sum+expense.amount,
        0
    );
    //Category wise totals
    const categoryTotals=monthlyExpenses.reduce<Record<string,number>> (
        (acc,expense)=>{
            (acc[expense.category]||0) + expense.amount;
            return acc;

        },
        {}
    );
    return(
        <section>
            <h3>Monthly Summary({month})</h3>
            <p>
                <strong>Total Expense:</strong> {totalMonthlyExpenses}
            </p>
            <h4>Category-wise breakdown</h4>

            {Object.keys(categoryTotals).length ===0?(
                <p>No expenses for this month</p>
            ):(
                <ul>
                    {Object.entries(categoryTotals).map(([category,amount])=>(
                        <li key={category}>
                            {category}:{amount}

                        </li>

                    ))}
                </ul>
            
            )}
        </section>
    )
}
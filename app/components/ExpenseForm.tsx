"use client";
import {useState,Dispatch,SetStateAction} from "react";
import {Expense} from "../types/expense";

type Props={
    setExpenses:Dispatch<SetStateAction<Expense[]>>;
}
 export default function ExpenseForm ({setExpenses}:Props){
    const[amount,setAmount]=useState<number | "">("");
    const[category,setCategory]=useState<string>("");
    const[note,setNote]=useState<string>("");

    const handleAddExpense=()=>{
        if(amount ==="")return;

        const newExpense:Expense ={
            id:Date.now(),
            amount:Number(amount),
            category,
            note,
            date:new Date().toISOString().slice(0,10)
        };
        setExpenses((prev:Expense[]) =>[...prev,newExpense]);

        //reset form
        setAmount("");
        setNote("");
    }

    return(
        <section>
            <input 
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e=>setAmount(e.target.value ===""?"":(Number(e.target.value)))} 
            />
            <select value={category} onChange={e=>setCategory(e.target.value)}>
                <option>Petrol</option>
                <option>Food</option>
                <option>Shopping</option>
                <option>Electricity</option>
                <option>Milk</option>
                <option>hotel</option>
                <option>Employee salary</option>
                <option>Other</option>
            </select>
            <input 
            placeholder="Note"
            value={note}
            onChange={e=>setNote(e.target.value)}
            />
            <button onClick={handleAddExpense}>Add Expense</button>
        </section>
    )
 }
"use client";
import {useEffect,useState} from "react";
import {Expense} from "./types/expense";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import MonthlySummary from "./components/MonthlySummary";
import {getExpenses} from "./utils/storage";
import Header from "./components/Header";

export default function Page(){
  const [expenses, setExpenses]=useState<Expense[]>([]);

  //Load expenses from backend 
  useEffect(()=>{
    const loadExpenses=async()=>{
      const data=await getExpenses();
      setExpenses(data);
    };
    loadExpenses();
  },[]);



  const currentMonth=new Date().toISOString().slice(0,7);

  return(
    <main className="max-w-5xl mx-auto p-6">
    <Header/>
    <ExpenseForm setExpenses={setExpenses}/>
    <MonthlySummary expenses={expenses} month={currentMonth}/>
    <ExpenseList expenses={expenses}/>
    </main>
  )
}


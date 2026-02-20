import {Expense} from "../types/expense";

const API_URL="http://localhost:5000/api/expenses";

//Get all expenses
export const getExpenses = async (): Promise<Expense[]> =>{
    const res = await fetch(API_URL);
    return res.json();
};

//Add expense
export const addExpense = async (expense:Omit<Expense,"id">)=>{
    const res = await fetch(API_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(expense),
    });
    return res.json();
    }

    //Update expense
    export const updateExpense = async(
        id:string,
        expense:Partial<Expense>
    )=>{
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(expense),
        });
    }

//Delete expense
export const deleteExpense = async(id:string)=>{
    await fetch(`${API_URL}/${id}`,{
        method:"DELETE",
    })
}

//Monthly summary
export const getMonthlySummary = async(month:number,year:number)=>{
    const res = await fetch(
        `${API_URL}/summary?month=${month}&year=${year}`
    );
    return res.json();
   
}
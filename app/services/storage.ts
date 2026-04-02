import {Expense} from "../types/expense";

const API_URL="http://localhost:5000/api/expenses";

//Get all expenses
export const getExpenses = async (): Promise<Expense[]> =>{
    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            console.error(`API error: ${res.status}`);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch expenses:", error);
        return [];
    }
};

//Add expense
export const addExpense = async (expense:Omit<Expense,"id">)=>{
    try {
        const res = await fetch(API_URL,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(expense),
        });
        if (!res.ok) {
            console.error(`API error: ${res.status}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Failed to add expense:", error);
        return null;
    }
}

    //Update expense
    export const updateExpense = async(
        id:string,
        expense:Partial<Expense>
    )=>{
        try {
            const res = await fetch(`${API_URL}/${id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(expense),
            });
            if (!res.ok) {
                console.error(`API error: ${res.status}`);
            }
        } catch (error) {
            console.error("Failed to update expense:", error);
        }
    }

//Delete expense
export const deleteExpense = async(id:string)=>{
    try {
        const res = await fetch(`${API_URL}/${id}`,{
            method:"DELETE",
        });
        if (!res.ok) {
            console.error(`API error: ${res.status}`);
        }
    } catch (error) {
        console.error("Failed to delete expense:", error);
    }
}

//Monthly summary
export const getMonthlySummary = async(month:number,year:number)=>{
    try {
        const res = await fetch(
            `${API_URL}/summary?month=${month}&year=${year}`
        );
        if (!res.ok) {
            console.error(`API error: ${res.status}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Failed to fetch monthly summary:", error);
        return null;
    }
}
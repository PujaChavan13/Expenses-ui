"use client";

 import{Card} from "@/components/ui/card";
 import{Separator}from "@/components/ui/separator";

 export default function Header(){
    return(
        <Card className="mb-6">
            <div className="flex items-center justify-between px-6 py-4">
                <h1 className="text-xl font-semibold tracking-tight">Expense Tracker</h1>

                <nav className="flex items-center gap-6 text-sm font-medium">
                    <span className="cursor-pointer text-muted-foreground hover:text-primary">
                        Add Expense</span>
                         <span className="cursor-pointer text-muted-foreground hover:text-primary">
                        Monthly Summary</span>
                         <span className="cursor-pointer text-muted-foreground hover:text-primary">
                        Expense List</span>
                </nav>
            </div>
            <Separator />
        </Card>
    )
 }
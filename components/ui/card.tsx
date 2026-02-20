"use client";
import {ReactNode} from "react";
import cn from "classnames";

interface CardProps{
    children:ReactNode;
    className?:string;
}

export  function Card({children,className}:CardProps){
    return(
        <div className={cn(
            "bg-white shadow=-md rounded-lg border border-gray-200 p-4",
            className
        )}>
            {children}
        </div>
    )
}
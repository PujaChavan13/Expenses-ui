import * as React from "react";

interface SeparatorProps{
    className?:string;
}

export function Separator({className=""}:SeparatorProps){
    return(
        <div
        role="separator"
        className={`h-px w-full bg-gray-200 ${className}`}
        />
    )
}
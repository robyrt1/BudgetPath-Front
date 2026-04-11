"use client";
import dynamic from "next/dynamic";
const DebtList = dynamic(() => import("@/Views/Debts/ListDebtsView"));


export default function ListDebtsPage() {
    return <DebtList />
}
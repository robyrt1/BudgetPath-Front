"use client";
import dynamic from "next/dynamic";
const TransactionsViewDynamic = dynamic(() => import("@/Views/transactions/transactionsView"), { ssr: false });

export default function TransactionsPage() {
    return (
        <TransactionsViewDynamic />
    );
}

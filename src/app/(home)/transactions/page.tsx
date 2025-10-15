"use client";
import dynamic from "next/dynamic";
const LoadingDynamic = dynamic(() => import("@/app/(home)/home/loading"), { ssr: false });
const TransactionsViewDynamic = dynamic(() => import("@/Views/transactions/transactionsView"), { ssr: false });
export default function TransactionsPage() {

    return (
        <TransactionsViewDynamic />
    );
}

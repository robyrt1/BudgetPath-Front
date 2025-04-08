"use client";
import Loading from "@/app/(home)/home/loading";
import TransactionsView from "@/Views/transactions/transactionsView";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function TransactionsPage() {
    const router = useRouter();
    const token = useSelector((state: any) => {
        return state.auth.token
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (token === undefined) return;

        if (!token) {
            router.push("/SignIn");
        } else {
            setIsAuthenticated(true);
        }
    }, [token, router]);

    if (token === undefined || !isAuthenticated) {
        return <Loading />;
    }

    return (
        <TransactionsView />
    );
}

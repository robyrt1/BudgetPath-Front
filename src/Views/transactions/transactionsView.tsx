'use client';
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import { ResponseTransactions } from "@/Models/Transactions/Responses/ResponseTransacrions";
import TransactionsModel from "@/Models/Transactions/TransactionsModel";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TransactionGrid from "./Grid/TransactionGrid";

const TransactionsView = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { error, find } = UseFindTransactionViewModel({ UserId: userId });

    const addTransaction = async (newTransaction: RequestCreateTransaction) => {
        try {
            const result = await TransactionsModel.CreateTransaction(newTransaction);
            await fetchTransactions();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const fetchTransactions = async () => {
        if (userId) {
            const response: ResponseTransactions = await find({});
            setTransactions(response.Data || []);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [userId]);

    return (
        <div className="max-w-[1580px] max-h-[calc(50vh-100px)] w-full mx-auto px-4 md:px-8 flex flex-col mt-10 pb-8">
            <TransactionGrid
                transactions={transactions}
                addTransaction={addTransaction}
            />
        </div>
    );
};

export default TransactionsView;

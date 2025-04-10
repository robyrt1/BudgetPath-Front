import { ResponseAggregatedExpenses } from "@/Models/Transactions/Responses/ResponseAggregatedExpenses";
import TransactionsModel from "@/Models/Transactions/TransactionsModel";
import { useState } from "react";
import { IAggregatedExpenses, IAggregatedExpensesProps } from "./Types/FindTransactionsType";

const UseAggregatedExpensesViewModel = ({ groupBy, userId }: IAggregatedExpensesProps): IAggregatedExpenses => {
    const [data, setData] = useState<ResponseAggregatedExpenses[]>([])
    const [error, SetError] = useState<any>(null);

    return {
        data,
        error,
        find: async () => {
            try {
                const response = await TransactionsModel.AggregatedExpenses({ groupBy, userId });
                setData(response);
                return response;
            } catch (error) {
                SetError(String(error))
                return []
            }

        }
    }
}

export default UseAggregatedExpensesViewModel
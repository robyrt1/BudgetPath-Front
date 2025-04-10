import { ResponseAggregatedExpenses } from "@/Models/Transactions/Responses/ResponseAggregatedExpenses";
import { Datum, ResponseTransactions } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { ColDef } from "ag-grid-community";

export interface IFindTransactions {
    error: any,
    colDefs: ColDef<Datum>[];
    find: (input: { top?: number, group?: string }) => Promise<ResponseTransactions> | ResponseTransactions
}

export interface IFindTrasactionsProps {
    UserId: string,
}


export interface IAggregatedExpensesProps {
    userId: string; groupBy: string
}


export interface IAggregatedExpenses {
    error: any,
    data: ResponseAggregatedExpenses[]
    find: () => Promise<ResponseAggregatedExpenses[]> | ResponseAggregatedExpenses[]
}

import { ResponseAggregatedExpenses } from "@/Models/Transactions/Responses/ResponseAggregatedExpenses";
import { Datum, ResponseTransactions } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { ColDef } from "ag-grid-community";

export interface IFindTransactions {
    error: any,
    colDefs: ColDef<Datum>[];
    find: (input: { top?: number, group?: string, year?: string | number, month?: string | number }) => Promise<ResponseTransactions> | ResponseTransactions
}

export interface IFindTrasactionsProps {
    UserId: string,
}


export interface IAggregatedExpensesProps {
    userId: string; groupBy: string
}


export interface ITransformExpenseDataRequest {
    account: string, period: string, total: number
}

export interface ITransformExpenseDataResponse {
    period: string;
    [key: string]: number | string;
}

export interface IAggregatedExpenses {
    error: any,
    data: ResponseAggregatedExpenses[]
    find: () => Promise<ResponseAggregatedExpenses[]> | ResponseAggregatedExpenses[]
    transformExpensesData: (input: ITransformExpenseDataRequest[]) => ITransformExpenseDataResponse[]
    getAccountColor: (input: number) => string
}

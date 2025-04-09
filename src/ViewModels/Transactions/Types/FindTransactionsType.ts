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
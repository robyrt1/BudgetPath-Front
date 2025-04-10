import { RequestAggregatedExpenses, RequestCreateTransaction, RequestTransactions } from "../Requests/RequesTransactions";
import { ResponseAggregatedExpenses } from "../Responses/ResponseAggregatedExpenses";
import { ResponseTransactions } from "../Responses/ResponseTransacrions";

export interface TransactionsModelPort {
    FindTransactions(request: RequestTransactions): Promise<ResponseTransactions> | ResponseTransactions,
    CreateTransaction(request: RequestCreateTransaction): any
    AggregatedExpenses(request: RequestAggregatedExpenses): Promise<ResponseAggregatedExpenses[]>
}
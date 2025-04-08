import { RequestCreateTransaction, RequestTransactions } from "../Requests/RequesTransactions";
import { ResponseTransactions } from "../Responses/ResponseTransacrions";

export interface TransactionsModelPort {
    FindTransactions(request: RequestTransactions): Promise<ResponseTransactions> | ResponseTransactions,
    CreateTransaction(request: RequestCreateTransaction): any
}
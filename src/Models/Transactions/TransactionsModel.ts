import { TransactionsModelPort } from "./Port/TransactionsModelPort";
import { RequestTransactions } from "./Requests/RequesTransactions";
import { ResponseTransactions } from "./Responses/ResponseTransacrions";

const URL_FINANCE_API: string = process.env.REACT_APP_API_FINANCE_URL as string || 'http://localhost:5171/api/odata/v1/';

const TransactionsModel: TransactionsModelPort = {
    FindTransactions: async (request: RequestTransactions): Promise<ResponseTransactions> => {
        const response = await fetch(URL_FINANCE_API + `Transactions?$expand=data($expand=account,creditCard,user,debtInstallment,category($expand=group),debt;$filter=userId eq ${request.userId};$orderby=TransactionDate%20desc)`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result = await response.json();
        return result;
        1
    }
}


export default TransactionsModel;
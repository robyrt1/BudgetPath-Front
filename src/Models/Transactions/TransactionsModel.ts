import { UrlsService } from "@/shared/Constants/URLS";
import { TransactionsModelPort } from "./Port/TransactionsModelPort";
import { RequestTransactions } from "./Requests/RequesTransactions";
import { ResponseTransactions } from "./Responses/ResponseTransacrions";


const TransactionsModel: TransactionsModelPort = {
    FindTransactions: async (request: RequestTransactions): Promise<ResponseTransactions> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Transactions?$expand=data($expand=account,creditCard,user,paymentMethod,debtInstallment,category($expand=group),debt;$filter=userId eq ${request.userId};$orderby=TransactionDate desc;${request?.top ? '$top=' + request.top : ''})`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result = await response.json();
        return result;
        1
    }
}


export default TransactionsModel;
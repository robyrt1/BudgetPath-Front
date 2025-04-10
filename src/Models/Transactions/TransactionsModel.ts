import { UrlsService } from "@/shared/Constants/URLS";
import { TransactionsModelPort } from "./Port/TransactionsModelPort";
import { RequestAggregatedExpenses, RequestCreateTransaction, RequestTransactions } from "./Requests/RequesTransactions";
import { ResponseAggregatedExpenses } from "./Responses/ResponseAggregatedExpenses";
import { ResponseTransactions } from "./Responses/ResponseTransacrions";


const TransactionsModel: TransactionsModelPort = {
    FindTransactions: async (request: RequestTransactions): Promise<ResponseTransactions> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Transactions?$expand=data($expand=account,creditCard,user,paymentMethod,debtInstallment,category($expand=group),debt;$filter=userId eq ${request.userId} ${request?.group ? `and category/group/descript eq '${request.group}'` : ''};$orderby=TransactionDate desc;${request?.top ? '$top=' + request.top : ''})`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result = await response.json();
        return result;
    },

    CreateTransaction: async (request: RequestCreateTransaction) => {
        const response = await fetch(
            UrlsService.URL_FINANCE_API + `Transactions`,
            {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

        const result = await response.json();
        return result;
    },

    AggregatedExpenses: async (request: RequestAggregatedExpenses): Promise<ResponseAggregatedExpenses[]> => {
        const { userId, groupBy } = request;

        const response = await fetch(
            `${UrlsService.URL_FINANCE_API}Transactions/aggregated?userId=${userId}&groupBy=${groupBy}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const result = await response.json() as ResponseAggregatedExpenses[];
        return result;
    }
}


export default TransactionsModel;
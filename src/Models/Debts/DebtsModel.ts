import { UrlsService } from "@/shared/Constants/URLS";
import { IDebtsModelPort } from "./Port/DebtsModelPort";
import { FindByUseRequest } from "./Requests/FindByUser";
import { Debts, ResponseDebts } from "./Responses/FindByUser";

export const DebtsModel: IDebtsModelPort = {
    findByUser: async function (input: FindByUseRequest): Promise<Debts[]> {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Debts?$expand=data($expand=account,creditCard,category($expand=group);$filter=userId eq ${input.userId})`,
            {
                method: 'Get', headers: { 'Content-Type': 'application/json' }
            })

        const result = await response.json() as ResponseDebts;
        return result.data;
    }
}
import { UrlsService } from "@/shared/Constants/URLS";
import { IDebtsModelPort } from "./Port/DebtsModelPort";
import { FindByUseRequest } from "./Requests/FindByUser";
import { Debt, ResponseDebts } from "./Responses/FindByUser";

export const DebtsModel: IDebtsModelPort = {
    findByUser: async function (input: FindByUseRequest): Promise<Debt[]> {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Debts?$expand=data($expand=Account,DebtInstallments($orderby=InstallmentNumber),CreditCard,Category($expand=Group);$filter=userId eq ${input.userId})`,
            {
                method: 'Get', headers: { 'Content-Type': 'application/json' }
            })

        const result = await response.json() as ResponseDebts;
        return result.Data;
    }
}
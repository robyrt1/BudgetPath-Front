import { UrlsService } from "@/shared/Constants/URLS";
import { IDebtsModelPort } from "./Port/DebtsModelPort";
import { CreateDebtRequest } from "./Requests/CreateDebtRequest";
import { FindByUseRequest } from "./Requests/FindByUser";
import { Debt, ResponseDebts } from "./Responses/FindByUser";

export const DebtsModel: IDebtsModelPort = {
    findByUser: async function (input: FindByUseRequest): Promise<Debt[]> {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Debts?$expand=data($expand=Account,DebtInstallments($orderby=InstallmentNumber),CreditCard,Category($expand=Group);$filter=userId eq ${input.userId})`,
            {
                method: 'Get', headers: { 'Content-Type': 'application/json' }
            })

        const result = await response.json() as ResponseDebts;
        if (!response.ok || !result.Data) {
            console.error("Backend retornou erro ou não trouxe propriedade Data na busca", result);
            return [];
        }
        return result.Data;
    },

    createDebt: async function (input: CreateDebtRequest): Promise<void> {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Debts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });

        if (!response.ok) {
            throw new Error('Falha ao criar a dívida');
        }
    },

    deleteDebt: async function (debtId: string): Promise<void> {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Debts/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Id: debtId })
        });

        if (!response.ok) {
            throw new Error('Falha ao deletar a dívida');
        }
    }
}
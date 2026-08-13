import { UrlsService } from "@/shared/Constants/URLS";
import { ICreditCardsModelPort } from "./Port/CreditCardsModelPort";
import { CreateCreditCardRequest } from "./Requests/CreateCreditCardRequest";
import { UpdateCreditCardRequest } from "./Requests/UpdateCreditCardRequest";
import { DeleteCreditCardRequest } from "./Requests/DeleteCreditCardRequest";

const UseCreditCardsModel: ICreditCardsModelPort = {
    create: async (request: CreateCreditCardRequest): Promise<unknown> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + 'CreditCards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        return await response.json();
    },
    update: async (request: UpdateCreditCardRequest): Promise<unknown> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + 'CreditCards', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        return await response.json();
    },
    delete: async (request: DeleteCreditCardRequest): Promise<unknown> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + 'CreditCards', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        return await response.json();
    }
}

export default UseCreditCardsModel;

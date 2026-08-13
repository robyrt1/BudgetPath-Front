import { UrlsService } from "@/shared/Constants/URLS";
import { IAccountsModelPort } from "./Port/AccountsModelPort";
import { GetAccountUserRequest } from "./Requests/GetAccountsUserRequest";
import { GetAccountUserResponse } from "./Responses/GetAccountUserResponse";
import { CreateAccountRequest } from "./Requests/CreateAccountRequest";
import { UpdateAccountRequest } from "./Requests/UpdateAccountRequest";
import { DeleteAccountRequest } from "./Requests/DeleteAccountRequest";


const UseAccountModel: IAccountsModelPort = {
    findByUser: async (request: GetAccountUserRequest): Promise<GetAccountUserResponse[]> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Account?$expand=data($expand=CreditCard;$filter=userId eq ${request.userId})`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result = await response.json();
        return result['Data'];
    },
    create: async (request: CreateAccountRequest): Promise<unknown> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + 'Account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        return await response.json();
    },
    update: async (request: UpdateAccountRequest): Promise<unknown> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + 'Account', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        return await response.json();
    },
    delete: async (request: DeleteAccountRequest): Promise<unknown> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + 'Account', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        return await response.json();
    }
}


export default UseAccountModel;
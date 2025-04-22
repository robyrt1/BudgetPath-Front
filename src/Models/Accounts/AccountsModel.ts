import { UrlsService } from "@/shared/Constants/URLS";
import { IAccountsModelPort } from "./Port/AccountsModelPort";
import { GetAccountUserRequest } from "./Requests/GetAccountsUserRequest";
import { GetAccountUserResponse } from "./Responses/GetAccountUserResponse";


const UseAccountModel: IAccountsModelPort = {
    findByUser: async (request: GetAccountUserRequest): Promise<GetAccountUserResponse[]> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + `Account?$expand=data($expand=CreditCard;$filter=userId eq ${request.userId})`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result = await response.json();
        return result['Data'];
    }
}


export default UseAccountModel;
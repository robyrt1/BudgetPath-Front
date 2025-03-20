import { GetAccountUserRequest } from "../Requests/GetAccountsUserRequest";
import { GetAccountUserResponse } from "../Responses/GetAccountUserResponse";

export interface IAccountsModelPort {
    findByUser(request: GetAccountUserRequest): Promise<GetAccountUserResponse[]>
}
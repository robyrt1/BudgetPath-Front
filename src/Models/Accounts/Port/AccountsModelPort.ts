import { CreateAccountRequest } from "../Requests/CreateAccountRequest";
import { UpdateAccountRequest } from "../Requests/UpdateAccountRequest";
import { DeleteAccountRequest } from "../Requests/DeleteAccountRequest";
import { GetAccountUserRequest } from "../Requests/GetAccountsUserRequest";
import { GetAccountUserResponse } from "../Responses/GetAccountUserResponse";

export interface IAccountsModelPort {
    findByUser(request: GetAccountUserRequest): Promise<GetAccountUserResponse[]>;
    create(request: CreateAccountRequest): Promise<unknown>;
    update(request: UpdateAccountRequest): Promise<unknown>;
    delete(request: DeleteAccountRequest): Promise<unknown>;
}
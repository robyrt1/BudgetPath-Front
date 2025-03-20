import { GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";

export interface IAccountViewModelProps {
    UserId: string,
}

export interface IUseAccountViewModel {
    error: any;
    accounts: GetAccountUserResponse[],
    SetAccount: any
    find: () => void
}
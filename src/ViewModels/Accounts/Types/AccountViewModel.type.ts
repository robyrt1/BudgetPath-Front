import { CreditCard, GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { Dispatch } from "react";

export interface IAccountViewModelProps {
    UserId: string,
}

export interface IUseAccountViewModel {
    error: any;
    accounts: GetAccountUserResponse[],
    SetAccount: any
    credit: CreditCard
    setCredit: Dispatch<CreditCard>
    find: () => Promise<void>;
    create: (name: string, balance?: number) => Promise<unknown>;
    update: (id: string, name?: string, balance?: number) => Promise<unknown>;
    delete: (id: string) => Promise<unknown>;
}
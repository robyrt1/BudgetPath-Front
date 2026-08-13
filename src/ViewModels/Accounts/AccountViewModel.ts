import accountModel from "@/Models/Accounts/AccountsModel";
import { CreditCard, GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { useState } from "react";
import { IAccountViewModelProps, IUseAccountViewModel } from "./Types/AccountViewModel.type";


const AccountViewModel = (props: IAccountViewModelProps): IUseAccountViewModel => {
    const [error, SetError] = useState(null);
    const [accounts, SetAccount] = useState<GetAccountUserResponse[]>([]);
    const [credit, setCredit] = useState<CreditCard>({
        AccountId: '',
        AvailableBalance: 0,
        Closing: 0,
        Id: "",
        InvoiceAmount: 0,
        Limit: 0,
        Maturity: 0
        , Name: ""
    });

    return {
        error,
        accounts,
        SetAccount,
        credit,
        setCredit,
        find: async () => {
            const accounts = await accountModel.findByUser({ userId: props.UserId })
            SetAccount(accounts);
        },
        create: async (name: string, balance?: number) => {
            try {
                const res = await accountModel.create({
                    userId: props.UserId,
                    name,
                    balance
                });
                return res;
            } catch (err: any) {
                SetError(err);
                throw err;
            }
        },
        update: async (id: string, name?: string, balance?: number) => {
            try {
                const res = await accountModel.update({
                    id,
                    name,
                    balance
                });
                return res;
            } catch (err: any) {
                SetError(err);
                throw err;
            }
        },
        delete: async (id: string) => {
            try {
                const res = await accountModel.delete({ id });
                return res;
            } catch (err: any) {
                SetError(err);
                throw err;
            }
        }
    }
}

export default AccountViewModel;
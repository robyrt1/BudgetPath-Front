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
        }
    }
}

export default AccountViewModel;
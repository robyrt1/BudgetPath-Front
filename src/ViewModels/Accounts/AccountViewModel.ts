import accountModel from "@/Models/Accounts/AccountsModel";
import { GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { useState } from "react";
import { IAccountViewModelProps, IUseAccountViewModel } from "./Types/AccountViewModel.type";


const AccountViewModel = (props: IAccountViewModelProps): IUseAccountViewModel => {
    const [error, SetError] = useState(null);
    const [accounts, SetAccount] = useState<GetAccountUserResponse[]>([]);

    return {
        error,
        accounts,
        SetAccount,
        find: async () => {
            const accounts = await accountModel.findByUser({ userId: props.UserId })
            console.log("accounts >>>", accounts)
            SetAccount(accounts);
        }
    }
}

export default AccountViewModel;
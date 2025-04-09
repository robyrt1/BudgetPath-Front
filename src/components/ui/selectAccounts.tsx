import { CreditCard, GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface SelectCategoryProps {
    account: GetAccountUserResponse
    setAccount: (accounts: GetAccountUserResponse) => void
    creditCardProp: CreditCard | null | undefined,
    setCredit: (credit: CreditCard) => void

}

const SelectAccounts = ({ account, setAccount, setCredit, creditCardProp }: SelectCategoryProps) => {
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { accounts: selectAccounts, credit: selectCredit, find } = AccountViewModel({ UserId: userId });

    useEffect(() => {
        find();
    }, [userId]);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAccount(JSON.parse(event.target.value))
    };

    const handleSelectCreditChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value) {
            const data = JSON.parse(event.target.value);
            setCredit(JSON.parse(event.target.value))
            return
        }
        setCredit({
            AccountId: '',
            AvailableBalance: 0,
            Closing: 0,
            Id: "",
            InvoiceAmount: 0,
            Limit: 0,
            Maturity: 0
            , Name: ""
        })
    };

    return (
        <div>
            <div>
                <select
                    value={JSON.stringify(account)}
                    onChange={handleSelectChange}
                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                    <option value="">Select Account</option>
                    {selectAccounts.map((account: GetAccountUserResponse) => (
                        <option key={account.Id} value={JSON.stringify(account)}>
                            {account.Name}
                        </option>
                    )) ?? []}
                </select>
            </div>

            {
                !isEmpty(account.CreditCard) ? (
                    <div>
                        <select
                            value={JSON.stringify(creditCardProp)}
                            onChange={handleSelectCreditChange}
                            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Select Credit</option>
                            {account.CreditCard.map((creditCard: CreditCard, index) => (
                                <option key={creditCard.Id} value={JSON.stringify(creditCard)}>
                                    {creditCard.Name}
                                </option>
                            )) ?? []}
                        </select>
                    </div>
                ) : ""
            }
        </div>
    );
};

export default SelectAccounts;

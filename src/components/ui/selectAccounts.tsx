import { GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface SelectCategoryProps {
    account: GetAccountUserResponse,
    setAccount: (accounts: GetAccountUserResponse) => void
}

const SelectAccounts = ({ account, setAccount }: SelectCategoryProps) => {
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { accounts: selectAccounts, find } = AccountViewModel({ UserId: userId });

    useEffect(() => {
        find();
    }, [userId]);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAccount(JSON.parse(event.target.value))
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
        </div>
    );
};

export default SelectAccounts;

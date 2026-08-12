import { CreditCard, GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import Select from "./Select";

interface SelectCategoryProps {
    account: GetAccountUserResponse
    setAccount: (accounts: GetAccountUserResponse) => void
    creditCardProp: CreditCard | null | undefined,
    setCredit: (credit: CreditCard) => void
}

const SelectAccounts = ({ account, setAccount, setCredit, creditCardProp }: SelectCategoryProps) => {
    const t = useTranslations('addTransaction');
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { accounts: selectAccounts, find } = AccountViewModel({ UserId: userId });

    useEffect(() => {
        find();
    }, [userId, find]);

    const handleSelectChange = (value: string) => {
        if (value) {
            setAccount(JSON.parse(value));
        }
    };

    const handleSelectCreditChange = (value: string) => {
        if (value) {
            setCredit(JSON.parse(value))
            return
        }
        setCredit({
            AccountId: '',
            AvailableBalance: 0,
            Closing: 0,
            Id: "",
            InvoiceAmount: 0,
            Limit: 0,
            Maturity: 0,
            Name: ""
        })
    };

    const displayAccount = account.Id ? account.Name : "";
    const displayCredit = creditCardProp?.Id ? creditCardProp.Name : "";

    return (
        <div className="flex flex-col gap-2 w-full">
            <Select.Root
                value={account.Id ? JSON.stringify(account) : ""}
                onChange={handleSelectChange}
                placeholder={t('selectAccount')}
            >
                <Select.Trigger displayValue={displayAccount} />
                <Select.Content>
                    {selectAccounts.map((acc) => (
                        <Select.Option key={acc.Id} value={JSON.stringify(acc)}>
                            {acc.Name}
                        </Select.Option>
                    ))}
                </Select.Content>
            </Select.Root>

            {
                !isEmpty(account.CreditCard) && (
                    <Select.Root
                        value={creditCardProp?.Id ? JSON.stringify(creditCardProp) : ""}
                        onChange={handleSelectCreditChange}
                        placeholder={t('selectCredit')}
                    >
                        <Select.Trigger displayValue={displayCredit} />
                        <Select.Content>
                            {(account.CreditCard || []).map((card) => (
                                <Select.Option key={card.Id} value={JSON.stringify(card)}>
                                    {card.Name}
                                </Select.Option>
                            ))}
                        </Select.Content>
                    </Select.Root>
                )
            }
        </div>
    );
};

export default SelectAccounts;

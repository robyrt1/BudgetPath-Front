import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";

import { AuthState } from "@/Redux/Slices/AutheticationSlice";

import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function CardsView() {

    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { accounts, find, error } = AccountViewModel({ UserId: userId });


    const [showBalances, setShowBalances] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await find();
        };
        fetchData();
    }, [userId]);

    const handleEditAccount = (accountId: string) => {
        console.log('Edit account', accountId);
    }

    const handleAddCard = (accountId: string) => {
        console.log('Add card to account', accountId);
    }

    const handleEditCard = (cardId: string) => {
        console.log('Edit card', cardId);
    }

    return (
        <div className="home-container px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My accounts</h2>
                <button
                    onClick={() => setShowBalances(!showBalances)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                    {showBalances ? <FaEyeSlash className="mr-1" /> : <FaEye className="mr-1" />}
                    {showBalances ? "Hide balance" : "Show balance"}
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map(account => (
                    <div key={account.Id} className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-medium">{account.Name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-300">Saldo</p>
                                <p className="text-xl font-semibold">{showBalances ? account.Balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'R$ ****'}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button onClick={() => handleEditAccount(account.Id)} className="text-indigo-600 hover:text-indigo-800 text-sm">Editar conta</button>
                                {
                                    account.CreditCard.length > 0 ? '' : <button onClick={() => handleAddCard(account.Id)} className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">+ Cartão</button>
                                }
                            </div>
                        </div>

                        {account.CreditCard && account.CreditCard.length > 0 ? (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold mb-2">Cartões de crédito</h4>
                                <ul className="space-y-2">
                                    {account.CreditCard.map(card => (
                                        <li key={card.Id} className="border rounded p-3 bg-slate-50 dark:bg-slate-700 flex justify-between items-start">
                                            <div>
                                                <div className="font-medium">{card.Name}</div>
                                                <div className="text-sm text-slate-500">Limite: <span className="font-semibold">{card.Limit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                                                <div className="text-sm text-slate-500">Disponível: <span className="font-semibold">{showBalances ? card.AvailableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'R$ ****'}</span></div>
                                                <div className="text-sm text-slate-500">Fatura: <span className="font-semibold">{card.InvoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                                                <div className="text-xs text-slate-400">Fechamento: {card.Closing} • Vencimento: {card.Maturity}</div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <button onClick={() => handleEditCard(card.Id)} className="text-sm text-indigo-600 hover:text-indigo-800">Editar</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="mt-4 text-sm text-slate-500">Nenhum cartão de crédito cadastrado para esta conta.</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
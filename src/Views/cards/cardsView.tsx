import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";
import CreditCardsViewModel from "@/ViewModels/CreditCards/CreditCardsViewModel";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaPen, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import AccountModal from "./modal/AccountModal";
import CreditCardModal from "./modal/CreditCardModal";
import PayInvoiceModal from "./modal/PayInvoiceModal";
import { UrlsService } from "@/shared/Constants/URLS";

export default function CardsView() {

    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { accounts, find, create, update, delete: deleteAccount, error } = AccountViewModel({ UserId: userId });
    const { createCard, updateCard, deleteCard } = CreditCardsViewModel();

    const [showBalances, setShowBalances] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<{ Id: string; Name: string; Balance: number } | null>(null);

    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<{ Id: string; Name: string; Limit: number; Maturity: number; Closing: number } | null>(null);
    const [selectedAccountId, setSelectedAccountId] = useState("");

    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [selectedCardToPay, setSelectedCardToPay] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            await find();
        };
        fetchData();
    }, [userId]);

    const handleOpenAddModal = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (account: any) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const handleSave = async (name: string, balance: number) => {
        if (editingAccount) {
            await update(editingAccount.Id, name, balance);
        } else {
            await create(name, balance);
        }
        await find();
    };

    const handleDelete = async () => {
        if (editingAccount) {
            await deleteAccount(editingAccount.Id);
            await find();
        }
    };

    const handleAddCard = (accountId: string) => {
        setSelectedAccountId(accountId);
        setEditingCard(null);
        setIsCardModalOpen(true);
    };

    const handleEditCard = (card: any) => {
        setEditingCard(card);
        setIsCardModalOpen(true);
    };

    const handleSaveCard = async (name: string, limit: number, maturity: number, closing: number) => {
        if (editingCard) {
            await updateCard(editingCard.Id, name, undefined, limit, maturity, closing);
        } else {
            await createCard(name, selectedAccountId, limit, maturity, closing);
        }
        await find();
    };

    const handleDeleteCard = async () => {
        if (editingCard) {
            await deleteCard(editingCard.Id);
            await find();
        }
    };

    const handleOpenPayModal = (card: any) => {
        setSelectedCardToPay(card);
        setIsPayModalOpen(true);
    };

    const handleConfirmPay = async (
        accountId: string,
        amount: number,
        newAccountBalance: number,
        newAvailableBalance: number,
        newInvoiceAmount: number,
        transactionPayload: any
    ) => {
        // 1. Update Account balance
        await update(accountId, undefined, newAccountBalance);

        // 2. Update Credit Card details
        await updateCard(
            transactionPayload.creditCardId,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            newAvailableBalance,
            newInvoiceAmount
        );

        // 3. Create the payment transaction record
        await fetch(UrlsService.URL_FINANCE_API + 'Transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionPayload)
        });

        // 4. Refresh grid
        await find();
    };

    const getBankColor = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('nubank')) return 'bg-purple-500';
        if (lower.includes('itaú') || lower.includes('itau')) return 'bg-[#FF7A00]';
        if (lower.includes('inter')) return 'bg-[#FF7A00]';
        if (lower.includes('c6')) return 'bg-yellow-500';
        if (lower.includes('bradesco')) return 'bg-red-500';
        if (lower.includes('santander')) return 'bg-red-600';
        if (lower.includes('xp')) return 'bg-yellow-400';
        if (lower.includes('caixa')) return 'bg-blue-600';
        if (lower.includes('banco do brasil')) return 'bg-yellow-400';
        return 'bg-[#3B82F6]'; // default RMTECH accent
    }

    return (
        <div className="w-full min-h-screen max-w-[1750px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Minhas Contas</h2>
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer"
                    >
                        <FaPlus className="h-3 w-3" />
                        Nova Conta
                    </button>
                </div>
                <button
                    onClick={() => setShowBalances(!showBalances)}
                    className="flex items-center text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                    {showBalances ? <FaEyeSlash className="mr-2" /> : <FaEye className="mr-2" />}
                    {showBalances ? "Ocultar saldos" : "Mostrar saldos"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {accounts.map(account => (
                    <div key={account.Id} className="relative overflow-hidden bg-[#111827] border border-white/5 shadow-xl rounded-[24px] p-6 lg:p-8 flex flex-col transition-all hover:border-white/10">
                        {/* Status Bar */}
                        <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${getBankColor(account.Name)} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />

                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/80 border border-white/5 shadow-sm">
                                    <Icon icon="mingcute:bank-line" className="h-[22px] w-[22px]" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{account.Name}</h3>
                            </div>
                            <button
                                onClick={() => handleOpenEditModal(account)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                title="Editar conta"
                            >
                                <FaPen className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="mb-8">
                            <p className="text-[11px] mb-1 font-semibold uppercase tracking-widest text-slate-500">Saldo</p>
                            <p className="text-[32px] font-bold text-white tracking-tight leading-none">
                                {showBalances ? `R$ ${account.Balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ ****'}
                            </p>
                        </div>

                        {/* Credit Cards list with max-height or standard stack */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Cartões de crédito</h4>
                                <button
                                    onClick={() => handleAddCard(account.Id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#3B82F6]/20 transition-colors cursor-pointer"
                                >
                                    <FaPlus className="h-3 w-3" />
                                    Cartão
                                </button>
                            </div>

                            {account.CreditCard && account.CreditCard.length > 0 ? (
                                <ul className="space-y-3">
                                    {account.CreditCard.map(card => (
                                        <li key={card.Id} className="group border border-white/5 rounded-[16px] p-5 bg-white/5 flex flex-col gap-4 transition-colors hover:bg-white/10">
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-slate-100 text-[15px]">{card.Name}</div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleOpenPayModal(card)}
                                                        className="h-6 px-2 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                                                        title="Pagar Fatura"
                                                    >
                                                        Pagar
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditCard(card)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                                        title="Editar cartão"
                                                    >
                                                        <FaPen className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-emerald-500/5 rounded-lg p-2 border border-emerald-500/10">
                                                    <div className="text-[10px] text-emerald-400/80 uppercase tracking-wider mb-0.5 font-semibold">Disponível</div>
                                                    <div className="font-bold text-emerald-400 tracking-tight">{showBalances ? `R$ ${card.AvailableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ ****'}</div>
                                                </div>
                                                <div className="bg-rose-500/5 rounded-lg p-2 border border-rose-500/10">
                                                    <div className="text-[10px] text-rose-400/80 uppercase tracking-wider mb-0.5 font-semibold">Fatura atual</div>
                                                    <div className="font-bold text-rose-400 tracking-tight">{showBalances ? `R$ ${card.InvoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ ****'}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-1 pt-3 border-t border-white/5 text-[11px] text-slate-400 font-medium">
                                                <div title="Fechamento / Vencimento">
                                                    Fech. <span className="text-slate-300 font-semibold">{card.Closing}</span> • Venc. <span className="text-slate-300 font-semibold">{card.Maturity}</span>
                                                </div>
                                                <div className="text-slate-500">
                                                    Lim. R$ {card.Limit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 mt-2 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                    <div className="h-12 w-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-4 text-slate-500">
                                        <Icon icon="mingcute:card-pay-line" className="h-6 w-6" />
                                    </div>
                                    <div className="text-[13px] text-slate-500 text-center px-4 font-medium max-w-[200px] leading-relaxed">
                                        Nenhum cartão. Adicione um novo para controlar limites.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingAccount={editingAccount}
                onSave={handleSave}
                onDelete={handleDelete}
            />

            <CreditCardModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                accountId={selectedAccountId}
                editingCard={editingCard}
                onSave={handleSaveCard}
                onDelete={handleDeleteCard}
            />

            <PayInvoiceModal
                isOpen={isPayModalOpen}
                onClose={() => setIsPayModalOpen(false)}
                creditCard={selectedCardToPay}
                accounts={accounts}
                onConfirm={handleConfirmPay}
            />
        </div>
    );
}
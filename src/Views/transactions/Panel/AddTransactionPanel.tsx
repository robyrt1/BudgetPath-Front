import SelectAccounts from "@/components/ui/selectAccounts";
import SelectCategory from "@/components/ui/selectCategory";
import SelectPaymentMethod from "@/components/ui/selectPaymentMethod";
import { CreditCard, GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { PaymentMethod } from "@/Models/PaymentMethod/Responses/ResponseFindPaymentMethods";
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import React, { forwardRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import Input from "@/components/ui/Input/index";
import './addTransactionPanelCSS.css';
import { useCategoryPredictor } from "@/shared/hooks/useCategoryPredictor";

export interface IAddTransactionPanel {
    addTransaction: (newTransaction: RequestCreateTransaction) => Promise<unknown>
    style?: React.CSSProperties;
    id?: string
    ref?: any
}

const AddTransactionPanel = forwardRef<HTMLDivElement, IAddTransactionPanel>(({ addTransaction }, ref) => {
    const t = useTranslations('addTransaction');
    const [error, setError] = useState<string | null>(null);
    const [account, setAccount] = useState<GetAccountUserResponse>({
        Id: '',
        UserId: '',
        Name: '',
        Balance: 0,
        CreateAt: '',
        CreditCard: []
    });
    const [categoryId, setCategoryId] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethod | null>(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [credit, setCredit] = useState<CreditCard | null>();

    const getUserId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const getUserName = useSelector((state: { auth: AuthState }) => state.auth.nameUser);
    
    const { predictCategory } = useCategoryPredictor();

    const handleChangeValor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
        if (raw === '') {
            setAmount('');
            return;
        }
        const valorFormatado = (Number(raw) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        setAmount(valorFormatado);
    };

    const handleDescriptionBlur = () => {
        if (!description || description.trim().length < 3) return;

        try {
            const prediction = predictCategory(description);
            if (prediction && prediction.categoryId && prediction.confidence > 0.3) {
                setCategoryId(prediction.categoryId);
            }
        } catch (err) {
            console.error("AI categorization error:", err);
        }
    };

    const handlerCancel = () => {
        setTransactionType("");
        setAccount({
            Id: '',
            UserId: '',
            Name: '',
            Balance: 0,
            CreateAt: '',
            CreditCard: []
        });
        setAmount("");
        setCategoryId("");
        setDescription("");
        setPaymentMethodId(null);
        setError(null);
    };

    const handleSubmit = async () => {

        if (!categoryId || !account.Id || !paymentMethodId || !amount) {
            alert(t('requiredFields'));
            return;
        }

        const amountNumber = parseFloat(
            amount.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
        );

        try {
            const result: any = await addTransaction({
                userId: getUserId,
                creditCardId: credit?.Id || null,
                debtId: null,
                installmentId: null,
                categoryId: categoryId,
                paymentMethod: paymentMethodId.id,
                description: description,
                amount: amountNumber,
                transactionDate: transactionDate,
                accountId: credit?.Id ? null : account.Id
            });

            if (result?.errors) {
                return setError(result.errors.request)
            }
            handlerCancel()
        } catch (err: any) {
            setError(String(err))
        } finally {
            setCredit(null)
        }

    };

    return (
        <div ref={ref} className="w-full text-left">
            <div className="flex flex-col gap-4">
                {!transactionType && (
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-400 font-semibold transition-all group cursor-pointer"
                            onClick={() => setTransactionType("RECEITA")}
                        >
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                ↑
                            </div>
                            <span className="text-sm tracking-wider uppercase font-bold">{t('income')}</span>
                        </button>
                        <button
                            type="button"
                            className="flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-400 font-semibold transition-all group cursor-pointer"
                            onClick={() => setTransactionType("DESPESA")}
                        >
                            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                ↓
                            </div>
                            <span className="text-sm tracking-wider uppercase font-bold">{t('expense')}</span>
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                    {error}
                </div>
            )}

            {transactionType ? (
                <div className="flex flex-col gap-5 mt-2">
                    {/* User profile (Read-only) / type badge */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-sm">
                                {getUserName ? getUserName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="text-sm text-slate-300 font-medium">{getUserName}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${transactionType === 'RECEITA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                            {transactionType === 'RECEITA' ? t('income') : t('expense')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Account Select */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('account')}</label>
                            <SelectAccounts account={account} setAccount={setAccount} setCredit={setCredit} creditCardProp={credit} />
                        </div>

                        {/* Category Select */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('category')}</label>
                            <SelectCategory selectedCategoryId={categoryId} setSelectedCategoryId={setCategoryId} transactionType={transactionType} />
                        </div>

                        {/* Payment Method */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('paymentMethod')}</label>
                            <SelectPaymentMethod selectedPaymentMethod={paymentMethodId} setSelectedPaymentMethod={setPaymentMethodId} isCreditSelected={credit?.Id ? true : false} />
                        </div>

                        {/* Date */}
                        <Input.Root>
                            <Input.Label>{t('date')}</Input.Label>
                            <Input.Field
                                type="date"
                                value={transactionDate}
                                onChange={(e) => setTransactionDate(e.target.value)}
                                className="cursor-pointer"
                                required
                            />
                        </Input.Root>

                        {/* Amount */}
                        <Input.Root className="sm:col-span-2">
                            <Input.Label>{t('amountLabel')}</Input.Label>
                            <Input.Field
                                type="text"
                                placeholder={t('amount')}
                                value={amount}
                                onChange={handleChangeValor}
                                className="text-right text-slate-100 text-lg font-bold px-4 py-3"
                                required
                            />
                        </Input.Root>

                        {/* Description */}
                        <Input.Root className="sm:col-span-2">
                            <Input.Label>{t('description')}</Input.Label>
                            <Input.Field
                                type="text"
                                placeholder={t('description')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={handleDescriptionBlur}
                                required
                            />
                        </Input.Root>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                            onClick={handlerCancel}
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                            onClick={handleSubmit}
                        >
                            {t('submit')}
                        </button>
                    </div>
                </div>
            ) : ""}
        </div>
    );

});

export default AddTransactionPanel;

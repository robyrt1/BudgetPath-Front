import SelectAccounts from "@/components/ui/selectAccounts";
import SelectCategory from "@/components/ui/selectCategory";
import SelectPaymentMethod from "@/components/ui/selectPaymentMethod";
import { CreditCard, GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { PaymentMethod } from "@/Models/PaymentMethod/Responses/ResponseFindPaymentMethods";
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import React, { forwardRef, useState } from "react";
import { useSelector } from "react-redux";
import './addTransactionPanelCSS.css';

export interface IAddTransactionPanel {
    addTransaction: (newTransaction: RequestCreateTransaction) => Promise<void>
    style?: React.CSSProperties;
    id?: string
    ref?: any
}

const AddTransactionPanel = forwardRef<HTMLDivElement, IAddTransactionPanel>(({ addTransaction }, ref) => {
    const [Error, setError] = useState<any>(null);
    const [account, setAccount] = useState<GetAccountUserResponse>({
        Id: '',
        UserId: '',
        Name: '',
        Balance: 0,
        CreateAt: '',
        CreditCard: []
    });
    const [creditCardId, setCreditCardId] = useState("");
    const [debtId, setDebtId] = useState("");
    const [installmentId, setInstallmentId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethod | null>(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [credit, setCredit] = useState<CreditCard | null>();


    const getUserId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const getUserName = useSelector((state: { auth: AuthState }) => state.auth.nameUser);



    const handleChangeValor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
        const valorFormatado = (Number(raw) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        setAmount(valorFormatado);
    };

    const handlerSelectCreditCard = (id: string) => {
        setCreditCardId(id)
    }
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
        setCreditCardId("");
        setDescription("");
        setPaymentMethodId(null);
    }
    const handleSubmit = async () => {

        if (!categoryId || !account.Id || !paymentMethodId || !amount) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        const amountNumber = parseFloat(
            amount.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
        );

        try {
            const result: any = await addTransaction({
                userId: getUserId,
                creditCardId: credit?.Id || null,
                debtId: debtId || null,
                installmentId: installmentId || null,
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
        } catch (error: any) {
            const err = String(error)
            setError(err)
        }

    };

    return (
        <div ref={ref} className="add-transaction-panel">
            <h4>Adicionar Transação</h4>
            <hr className="border-gray-300 w-full" />

            {transactionType ? '' : (
                <div className="add-transaction-panel">
                    <button
                        className={`px-4 py-2 rounded bg-green-500 text-white`}
                        onClick={() => setTransactionType("RECEITA")}
                    >
                        Receita
                    </button>
                    <button
                        className={`px-4 py-2 rounded bg-red-500 text-white`}
                        onClick={() => setTransactionType("DESPESA")}
                    >
                        Despesa
                    </button>
                </div>
            )}

            {Error && <span className="text-red-600 text-sm">{Error}</span>}

            {transactionType ? (
                <div className="add-transaction-panel">
                    <div className="flex w-full">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            id="website-admin"
                            className="w-full bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block min-w-0 text-sm border-gray-300 p-2.5"
                            value={getUserName}
                            placeholder="elonmusk"
                            disabled
                        />
                    </div>
                    <SelectAccounts account={account} setAccount={setAccount} setCredit={setCredit} creditCardProp={credit} />
                    <SelectCategory selectedCategoryId={categoryId} setSelectedCategoryId={setCategoryId} transactionType={transactionType} />
                    <SelectPaymentMethod selectedPaymentMethod={paymentMethodId} setSelectedPaymentMethod={setPaymentMethodId} isCreditSelected={credit?.Id ? true : false} />
                    <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" required />
                    <input type="text-right" placeholder="R$ 0,00" value={amount} onChange={handleChangeValor} className="w-full px-3 py-2 border rounded text-left" required />
                    <input type="date" placeholder="Data da Transação" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} className="input-field" required />
                    <button className="submit-btn" onClick={handleSubmit}>Adicionar Transação</button>
                    <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={handlerCancel}>Cancelar</button>

                </div>
            ) : ""}
        </div>
    );

});

export default AddTransactionPanel;

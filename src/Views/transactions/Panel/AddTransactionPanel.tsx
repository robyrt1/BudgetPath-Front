import SelectAccounts from "@/components/ui/selectAccounts";
import SelectCategory from "@/components/ui/selectCategory";
import { GetAccountUserResponse } from "@/Models/Accounts/Responses/GetAccountUserResponse";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import React, { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './addTransactionPanelCSS.css';

export interface IAddTransactionPanel {
    addTransaction: (newTransaction: any) => void
    style?: React.CSSProperties;
    id?: string
    ref?: any
}

const AddTransactionPanel = forwardRef<HTMLDivElement, IAddTransactionPanel>(({ addTransaction }, ref) => {
    const [userId, setUserId] = useState("");
    const [account, setAccount] = useState<GetAccountUserResponse>({
        Id: '',
        UserId: '',
        Name: '',
        Balance: 0,
        CreateAt: '',
    });
    const [creditCardId, setCreditCardId] = useState("");
    const [debtId, setDebtId] = useState("");
    const [installmentId, setInstallmentId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionDate, setTransactionDate] = useState("");

    const dispatch = useDispatch();
    const getUserId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const getUserName = useSelector((state: { auth: AuthState }) => state.auth.nameUser);


    const handleSubmit = () => {
        if (!userId || !categoryId || !paymentMethodId || !description || !amount || !transactionDate) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        addTransaction({
            UserId: userId,
            CreditCardId: creditCardId || null,
            DebtId: debtId || null,
            InstallmentId: installmentId || null,
            CategoryId: categoryId,
            PaymentMethodId: paymentMethodId,
            Description: description,
            Amount: parseFloat(amount),
            TransactionDate: new Date(transactionDate),
        });

        setUserId("");
        setCreditCardId("");
        setDebtId("");
        setInstallmentId("");
        setCategoryId("");
        setPaymentMethodId("");
        setDescription("");
        setAmount("");
        setTransactionDate("");
    };

    return (
        <div ref={ref} className="add-transaction-panel">
            <h4>Adicionar Transação</h4>
            <hr className="border-gray-300 w-full" />
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
            <SelectAccounts account={account} setAccount={setAccount} />
            <input type="text" placeholder="Cartão de Crédito (Opcional)" value={creditCardId} onChange={(e) => setCreditCardId(e.target.value)} className="input-field" />
            <SelectCategory selectedCategoryId={categoryId} setSelectedCategoryId={setCategoryId} />
            <input type="text" placeholder="Método de Pagamento" value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} className="input-field" required />
            <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" required />
            <input type="number" placeholder="Valor" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" required />
            <input type="date" placeholder="Data da Transação" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} className="input-field" required />
            <button className="submit-btn" onClick={handleSubmit}>Adicionar Transação</button>
        </div>
    );

});

export default AddTransactionPanel;

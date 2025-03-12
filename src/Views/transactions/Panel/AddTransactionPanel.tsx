import SelectCategory from "@/components/ui/selectCategory";
import { useState } from "react";

const AddTransactionPanel = ({ addTransaction }: { addTransaction: (newTransaction: any) => void }) => {
    const [userId, setUserId] = useState("");
    const [accountId, setAccountId] = useState("");
    const [creditCardId, setCreditCardId] = useState("");
    const [debtId, setDebtId] = useState("");
    const [installmentId, setInstallmentId] = useState("");
    const [categoryId, setCategoryId] = useState("");  // Agora vai receber a categoria selecionada
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = () => {
        if (!userId || !categoryId || !paymentMethodId || !description || !amount || !transactionDate) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        addTransaction({
            UserId: userId,
            AccountId: accountId || null,
            CreditCardId: creditCardId || null,
            DebtId: debtId || null,
            InstallmentId: installmentId || null,
            CategoryId: categoryId,  // O categoryId será atualizado pelo SelectCategory
            PaymentMethodId: paymentMethodId,
            Description: description,
            Amount: parseFloat(amount),
            TransactionDate: new Date(transactionDate),
            Status: status || "Pending",
        });

        // Limpa os campos após adicionar a transação
        setUserId("");
        setAccountId("");
        setCreditCardId("");
        setDebtId("");
        setInstallmentId("");
        setCategoryId("");  // Limpa a categoria após a transação
        setPaymentMethodId("");
        setDescription("");
        setAmount("");
        setTransactionDate("");
        setStatus("");
    };

    return (
        <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4>Adicionar Transação</h4>
            <input type="text" placeholder="Usuário" value={userId} onChange={(e) => setUserId(e.target.value)} required />
            <input type="text" placeholder="Conta (Opcional)" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
            <input type="text" placeholder="Cartão de Crédito (Opcional)" value={creditCardId} onChange={(e) => setCreditCardId(e.target.value)} />
            <input type="text" placeholder="Dívida (Opcional)" value={debtId} onChange={(e) => setDebtId(e.target.value)} />
            <input type="text" placeholder="Parcela (Opcional)" value={installmentId} onChange={(e) => setInstallmentId(e.target.value)} />

            {/* Substituindo o campo de texto de categoria por SelectCategory */}
            <SelectCategory
                selectedCategoryId={categoryId}
                setSelectedCategoryId={setCategoryId}  // Atualiza a categoria selecionada
            />

            <input type="text" placeholder="Método de Pagamento" value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} required />
            <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="number" placeholder="Valor" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <input type="date" placeholder="Data da Transação" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} required />
            <input type="text" placeholder="Status (Opcional)" value={status} onChange={(e) => setStatus(e.target.value)} />
            <button onClick={handleSubmit}>Adicionar Transação</button>
        </div>
    );
};

export default AddTransactionPanel;

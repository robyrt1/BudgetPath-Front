import React, { useEffect, useState } from "react";
import { UrlsService } from "@/shared/Constants/URLS";
import { useSelector } from "react-redux";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

interface PayInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    creditCard: {
        Id: string;
        Name: string;
        AvailableBalance: number;
        InvoiceAmount: number;
        Limit: number;
        AccountId: string;
    } | null;
    accounts: any[];
    onConfirm: (
        accountId: string,
        amount: number,
        newAccountBalance: number,
        newAvailableBalance: number,
        newInvoiceAmount: number,
        transactionPayload: any
    ) => Promise<void>;
}

export default function PayInvoiceModal({ isOpen, onClose, creditCard, accounts, onConfirm }: PayInvoiceModalProps) {
    const t = useTranslations('accounts');
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);

    const [selectedAccountId, setSelectedAccountId] = useState("");
    const [payAmount, setPayAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // State to resolve payment method and category automatically from backend
    const [resolvedCategory, setResolvedCategory] = useState<string | null>(null);
    const [resolvedPaymentMethod, setResolvedPaymentMethod] = useState<string | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && creditCard) {
            setSelectedAccountId(creditCard.AccountId || (accounts[0]?.Id || ""));
            setPayAmount(creditCard.InvoiceAmount.toString());
            setErrorMsg("");
            setLoading(false);

            // Fetch categories and payment methods to get valid GUIDs for the transaction
            const fetchRequirements = async () => {
                try {
                    // 1. Resolve category preference from DB, fallback to LocalStorage, fallback to remote defaults
                    let categoryIdToUse = "";
                    try {
                        const settingsRes = await fetch(UrlsService.URL_FINANCE_API + `User/${userId}/cardPaymentCategory`).then(r => r.json());
                        if (settingsRes && settingsRes.cardPaymentCategoryId) {
                            categoryIdToUse = settingsRes.cardPaymentCategoryId;
                            localStorage.setItem(`budgetpath_card_payment_category_id_${userId}`, categoryIdToUse);
                        }
                    } catch (e) {
                        console.warn("Could not load category preference from DB, trying local storage...", e);
                    }

                    if (!categoryIdToUse) {
                        categoryIdToUse = localStorage.getItem(`budgetpath_card_payment_category_id_${userId}`) || "";
                    }

                    if (categoryIdToUse) {
                        setResolvedCategory(categoryIdToUse);
                    } else {
                        // Fetch categories as fallback
                        const catRes = await fetch(UrlsService.URL_FINANCE_API + `CategoriesOData?$expand=data($expand=Group;$filter=ParentId eq null and (UserId eq ${userId} or UserId eq null))`).then(r => r.json());
                        const catList = catRes.Data || [];
                        const expenseCat = catList.find((c: any) => c?.Descript === "Pagamentos Parcelados") || catList[0];
                        if (expenseCat) {
                            setResolvedCategory(expenseCat.Id);
                        }
                    }

                    // 2. Fetch payment methods
                    const pmRes = await fetch(UrlsService.URL_FINANCE_API + `PaymentMethod`).then(r => r.json());
                    const pmList = pmRes.data || pmRes.Data || [];
                    setPaymentMethods(pmList);
                    
                    // Find first method like PIX or Boleto
                    const pixMethod = pmList.find((p: any) => (p.description || p.Description || "").toLowerCase().includes("pix") || (p.description || p.Description || "").toLowerCase().includes("dinheiro")) || pmList[0];
                    if (pixMethod) {
                        setResolvedPaymentMethod(pixMethod.id || pixMethod.Id);
                    }
                } catch (err) {
                    console.error("Failed to load payment requirements:", err);
                }
            };

            fetchRequirements();
        }
    }, [isOpen, creditCard, accounts, userId]);

    if (!isOpen || !creditCard) return null;

    const selectedAccount = accounts.find(a => a.Id === selectedAccountId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        const amountNum = parseFloat(payAmount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setErrorMsg(t('errorAmount'));
            return;
        }

        if (!selectedAccount) {
            setErrorMsg(t('errorNoAccount'));
            return;
        }

        if (selectedAccount.Balance < amountNum) {
            setErrorMsg(t('errorInsufficientFunds'));
            return;
        }

        if (!resolvedCategory || !resolvedPaymentMethod) {
            setErrorMsg(t('errorLoadingParams'));
            return;
        }

        setLoading(true);
        try {
            const newAccountBalance = selectedAccount.Balance - amountNum;
            const newAvailableBalance = creditCard.AvailableBalance + amountNum;
            const newInvoiceAmount = creditCard.InvoiceAmount - amountNum;

            const todayStr = new Date().toISOString().substring(0, 10);

            const transactionPayload = {
                userId: userId,
                accountId: selectedAccountId,
                creditCardId: creditCard.Id,
                categoryId: resolvedCategory,
                description: `Pagamento Fatura - ${creditCard.Name}`,
                amount: amountNum,
                transactionDate: todayStr,
                paymentMethod: resolvedPaymentMethod,
                status: "Pago"
            };

            await onConfirm(
                selectedAccountId,
                amountNum,
                newAccountBalance,
                newAvailableBalance,
                newInvoiceAmount,
                transactionPayload
            );

            onClose();
        } catch (err: any) {
            setErrorMsg(t('errorPayInvoice'));
        } finally {
            setLoading(false);
        }
    };

    const getSelectedAccountName = () => {
        if (!selectedAccount) return "";
        return `${selectedAccount.Name} (Saldo: R$ ${selectedAccount.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })})`;
    };

    const getSelectedPaymentMethodName = () => {
        if (!resolvedPaymentMethod) return "";
        const pm = paymentMethods.find(p => (p.id || p.Id) === resolvedPaymentMethod);
        return pm ? (pm.Description || pm.description) : "";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#111827] border border-white/10 rounded-[28px] max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="absolute top-4 right-4 h-8 w-8 text-slate-400 hover:text-white"
                >
                    ✕
                </Button>
                <h3 className="text-lg font-bold text-white mb-2">
                    Pagar Fatura
                </h3>
                <p className="text-xs text-slate-400 mb-6 uppercase tracking-wider font-semibold">
                    {creditCard.Name}
                </p>

                {errorMsg && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Conta de Origem
                        </label>
                        <Select.Root
                            value={selectedAccountId}
                            onChange={setSelectedAccountId}
                            placeholder="Selecione a Conta"
                        >
                            <Select.Trigger displayValue={getSelectedAccountName()} />
                            <Select.Content>
                                {accounts.map(acc => (
                                    <Select.Option key={acc.Id} value={acc.Id}>
                                        {acc.Name} (Saldo: R$ {acc.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                                    </Select.Option>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Forma de Pagamento
                        </label>
                        <Select.Root
                            value={resolvedPaymentMethod || ""}
                            onChange={(val) => setResolvedPaymentMethod(val)}
                            placeholder="Selecione a Forma"
                        >
                            <Select.Trigger displayValue={getSelectedPaymentMethodName()} />
                            <Select.Content>
                                {paymentMethods.map(pm => (
                                    <Select.Option key={pm.id || pm.Id} value={pm.id || pm.Id}>
                                        {pm.Description || pm.description}
                                    </Select.Option>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <Input.Root>
                        <Input.Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Valor do Pagamento (R$)
                        </Input.Label>
                        <Input.Field
                            type="number"
                            step="0.01"
                            required
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            placeholder="0,00"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-medium">
                            <span>Valor total da fatura:</span>
                            <span className="text-slate-200 font-bold">R$ {creditCard.InvoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </Input.Root>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="w-full py-3 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800"
                        >
                            {loading ? "Processando..." : "Confirmar Pagamento"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

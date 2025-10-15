import { DebtInstallment } from "@/Models/Debts/Responses/FindByUser";
const getStatusStyles = (status: DebtInstallment['Status']) => {
    switch (status) {
        case 'Pago':
            return {
                containerClass: "bg-green-600/20 border-green-700/50",
                textClass: "text-green-400 font-semibold",
                statusText: "PAGA"
            };
        case 'Pendente':
            return {
                containerClass: "bg-blue-600/20 border-blue-700/50",
                textClass: "text-blue-300",
                statusText: "PENDENTE"
            };
        case 'Atrasado':
            return {
                containerClass: "bg-red-600/20 border-red-700/50",
                textClass: "text-red-400 font-bold",
                statusText: "ATRASADA"
            };
        default:
            return {
                containerClass: "bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.04)]",
                textClass: "text-sm",
                statusText: status.toUpperCase()
            };
    }
};

const Installments = ({ debt, onClose }: any) => {
    const remainingInstallments = Math.max(0, (debt.Installments ?? 1) - 1);
    const installmentValue = remainingInstallments > 0 ? (debt.RemainingAmount / remainingInstallments).toFixed(2) : (debt.RemainingAmount ?? 0).toFixed(2);
    console.log(debt.DebtInstallments)
    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-50">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative bg-[var(--background)] text-[var(--foreground)] p-6 rounded-lg shadow-lg max-w-4xl w-full border border-[rgba(255,255,255,0.04)]">
                <h2 className="text-2xl font-semibold mb-4">Parcelas: {debt.Description}</h2>

                <div className="max-h-72 overflow-auto pr-2">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {debt.DebtInstallments.map((installment: DebtInstallment, index: number) => {
                            const styles = getStatusStyles(installment.Status); // <--- AQUI!

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col p-3 rounded-lg shadow ${styles.containerClass}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm">Parcela **{installment.InstallmentNumber}**</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${styles.textClass}`}>{styles.statusText}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-[var(--text-muted)]">Vencimento: {new Date(installment.DueDate).toLocaleDateString()}</span>
                                        <span className="text-base font-bold text-white">R$ {Number(installment.Amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    className="mt-4 text-red-500 hover:underline"
                    onClick={onClose}
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default Installments;

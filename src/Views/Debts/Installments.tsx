import { DebtInstallment } from "@/Models/Debts/Responses/FindByUser";

const getStatusStyles = (status: DebtInstallment['Status']) => {
    switch (status) {
        case 'Pago':
        case 'PAGA':
        case 'PAGO':
            return {
                containerClass: "bg-emerald-500/10 border-emerald-500/20",
                textClass: "text-emerald-400",
                statusText: "PAGA"
            };
        case 'Pendente':
        case 'PENDENTE':
            return {
                containerClass: "bg-amber-500/10 border-amber-500/20",
                textClass: "text-amber-400",
                statusText: "PENDENTE"
            };
        case 'Atrasado':
        case 'ATRASADA':
            return {
                containerClass: "bg-rose-500/10 border-rose-500/20",
                textClass: "text-rose-400",
                statusText: "ATRASADA"
            };
        default:
            return {
                containerClass: "bg-white/5 border-white/10",
                textClass: "text-slate-300",
                statusText: (status || 'INVÁLIDO').toUpperCase()
            };
    }
};

const Installments = ({ debt, onClose }: any) => {
    const remainingInstallments = Math.max(0, (debt.Installments ?? 1) - 1);
    const installmentValue = remainingInstallments > 0 ? (debt.RemainingAmount / remainingInstallments).toFixed(2) : (debt.RemainingAmount ?? 0).toFixed(2);
    console.log(debt.DebtInstallments)
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 pt-10 pb-10">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative bg-[#111827] border border-white/10 shadow-2xl rounded-[24px] max-w-4xl w-full p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Parcelas: <span className="text-slate-400 font-medium">{debt.Description}</span></h2>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {debt.DebtInstallments.map((installment: DebtInstallment, index: number) => {
                            const styles = getStatusStyles(installment.Status);

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col p-5 rounded-2xl border transition-colors ${styles.containerClass}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Parcela</span>
                                            <span className="text-xl font-bold text-white leading-none">{installment.InstallmentNumber}</span>
                                        </div>
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider bg-black/20 ${styles.textClass}`}>
                                            {styles.statusText}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-t border-black/10 pt-4 mt-auto">
                                        <div className="flex justify-between items-center text-[11px] mb-2">
                                            <span className="font-bold text-slate-500 uppercase tracking-widest">Vencimento</span>
                                            <span className="font-semibold text-slate-300">{new Date(installment.DueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-slate-500 uppercase tracking-widest text-[11px] pb-1">Valor</span>
                                            <span className="text-xl font-bold text-white tracking-tight leading-none">
                                                <span className="text-sm font-medium mr-1 text-slate-400">R$</span>
                                                {Number(installment.Amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Installments;

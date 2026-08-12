import React from "react";
import { useTranslations } from "next-intl";
import { formatNumber } from "@/shared/formatNumber";

interface TransactionSummaryCardsProps {
    totalReceita: number;
    totalDespesa: number;
}

export const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({ totalReceita, totalDespesa }) => {
    const t = useTranslations('transactions');
    const balance = totalReceita - totalDespesa;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:flex md:flex-wrap md:gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">{t('summary.income')}</span>
                <span className="text-sm font-semibold text-emerald-400">R$ {formatNumber(String(totalReceita))}</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">{t('summary.expense')}</span>
                <span className="text-sm font-semibold text-rose-400">R$ {formatNumber(String(totalDespesa))}</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('summary.balance')}</span>
                <span className={`text-sm font-semibold ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    R$ {formatNumber(String(balance))}
                </span>
            </div>
        </div>
    );
};

export default TransactionSummaryCards;

import React from "react";
import { useTranslations } from "next-intl";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { formatNumber } from "@/shared/formatNumber";
import { GroupBadge, StatusBadge } from "../Grid/TransactionGrid";

interface TransactionMobileListProps {
    paginated: Datum[];
    getAccount: (row: Datum) => string;
    formatDate: (date: string | number | Date | null | undefined) => string;
}

export const TransactionMobileList: React.FC<TransactionMobileListProps> = ({
    paginated,
    getAccount,
    formatDate
}) => {
    const t = useTranslations('transactions');

    return (
        <div className="block md:hidden space-y-3">
            {paginated.length === 0 ? (
                <div className="px-4 py-12 text-center text-slate-500 text-sm rounded-2xl border border-white/5 bg-[#111827]">
                    {t('noResults')}
                </div>
            ) : (
                paginated.map((row, i) => {
                    const group = row.Category?.Group?.Descript ?? '';
                    const amountColor = group === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400';
                    const account = getAccount(row) || '—';
                    const category = row.Category?.Descript ?? '—';
                    const amount = row.Amount != null ? `R$ ${formatNumber(String(row.Amount))}` : '—';
                    const description = row.Description ?? '—';
                    const date = formatDate(row.TransactionDate);
                    const status = row.Status;

                    return (
                        <div key={row.Id ?? i} className="p-4 rounded-xl border border-white/5 bg-[#131926] flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-100 font-medium text-sm line-clamp-1 flex-1" title={description}>
                                    {description}
                                </span>
                                <span className={`font-semibold text-sm whitespace-nowrap ${amountColor}`}>
                                    {amount}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>{category}</span>
                                <span>{account}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">{date}</span>
                                <div className="flex items-center gap-1.5">
                                    {group ? <GroupBadge group={group} /> : '—'}
                                    {status ? <StatusBadge status={status} /> : '—'}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default TransactionMobileList;

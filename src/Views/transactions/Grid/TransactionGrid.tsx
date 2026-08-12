'use client';
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { formatNumber } from "@/shared/formatNumber";
import { useTranslations } from "next-intl";
import React from "react";
import AddTransactionPanel from "../Panel/AddTransactionPanel";
import TransactionFilterPanel from "../Components/TransactionFilterPanel";
import TransactionSummaryCards from "../Components/TransactionSummaryCards";
import TransactionMobileList from "../Components/TransactionMobileList";
import TransactionToolbar from "../Components/TransactionToolbar";
import TransactionPaginationBar from "../Components/TransactionPaginationBar";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { useTransactionGridViewModel, SortKey, getAccount, formatDate } from "@/ViewModels/Transactions/TransactionGridViewModel";

interface Props {
    transactions: Datum[];
    addTransaction: (data: RequestCreateTransaction) => Promise<unknown>;
    onGridReady?: (params: unknown) => void;
    onGroupBy?: (column: string) => void;
    colDefs?: unknown[];
}

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100];

export const GroupBadge = ({ group }: { group: string }) => (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${group === 'RECEITA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}>
        {group}
    </span>
);

export const StatusBadge = ({ status }: { status: string }) => {
    const isPaid = status === 'EFETIVADA' || status === 'PAGO';
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-300'
            }`}>
            {status}
        </span>
    );
};

const TransactionGrid: React.FC<Props> = ({ transactions, addTransaction }) => {
    const t = useTranslations('transactions');

    const vm = useTransactionGridViewModel(transactions);

    const COLUMNS: { key: SortKey; label: string; align?: string }[] = [
        { key: 'Category', label: t('columns.category') },
        { key: 'Account', label: t('columns.account'), align: 'center' },
        { key: 'Amount', label: t('columns.amount'), align: 'center' },
        { key: 'Description', label: t('columns.description') },
        { key: 'PaymentMethod', label: t('columns.paymentMethod'), align: 'center' },
        { key: 'TransactionDate', label: t('columns.date'), align: 'center' },
        { key: 'Group', label: t('columns.group'), align: 'center' },
        { key: 'Status', label: t('columns.status'), align: 'center' },
    ];

    const SortIcon = ({ col }: { col: SortKey }) => {
        if (vm.sortKey !== col) return <span className="ml-1 opacity-25 text-xs">↕</span>;
        return <span className="ml-1 text-indigo-400 text-xs">{vm.sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="relative flex flex-col gap-3 w-full">

            <TransactionToolbar
                search={vm.search}
                setSearch={vm.setSearch}
                filtersOpen={vm.filtersOpen}
                setFiltersOpen={vm.setFiltersOpen}
                activeFilters={vm.activeFilters}
                clearFilters={vm.clearFilters}
                resetPage={vm.resetPage}
                setIsModalOpen={vm.setIsModalOpen}
            />

            {vm.filtersOpen && (
                <TransactionFilterPanel
                    filterGroup={vm.filterGroup}
                    setFilterGroup={vm.setFilterGroup}
                    filterStatus={vm.filterStatus}
                    setFilterStatus={vm.setFilterStatus}
                    filterAccount={vm.filterAccount}
                    setFilterAccount={vm.setFilterAccount}
                    dateFrom={vm.dateFrom}
                    setDateFrom={vm.setDateFrom}
                    dateTo={vm.dateTo}
                    setDateTo={vm.setDateTo}
                    amountMin={vm.amountMin}
                    setAmountMin={vm.setAmountMin}
                    amountMax={vm.amountMax}
                    setAmountMax={vm.setAmountMax}
                    statusOptions={vm.statusOptions}
                    accountOptions={vm.accountOptions}
                    resetPage={vm.resetPage}
                />
            )}

            <TransactionSummaryCards
                totalReceita={vm.totalReceita}
                totalDespesa={vm.totalDespesa}
            />

            <div className="hidden md:block max-h-[690px] overflow-y-auto w-full overflow-x-auto rounded-2xl border border-white/5 bg-[#111827] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <Table className="hidden md:table w-full text-sm text-left">
                    <TableHeader>
                        <TableRow className="border-b border-white/5">
                            {COLUMNS.map(col => (
                                <TableHead
                                    key={col.key}
                                    onClick={() => vm.handleSort(col.key)}
                                    className={`px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-slate-200 transition-colors ${col.align === 'center' ? 'text-center' : ''}`}
                                >
                                    {col.label}<SortIcon col={col.key} />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vm.paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={COLUMNS.length} className="px-4 py-12 text-center text-slate-500 text-sm">
                                    {t('noResults')}
                                </TableCell>
                            </TableRow>
                        ) : vm.paginated.map((row, i) => {
                            const group = row.Category?.Group?.Descript ?? '';
                            const amountColor = group === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400';
                            return (
                                <TableRow key={row.Id ?? i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                    <TableCell className="px-4 py-2.5 text-slate-400 font-medium whitespace-nowrap">
                                        {row.Category?.Descript ?? '—'}
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-slate-400 text-center whitespace-nowrap">
                                        {getAccount(row) || '—'}
                                    </TableCell>
                                    <TableCell className={`px-4 py-2.5 text-center font-semibold whitespace-nowrap ${amountColor}`}>
                                        {row.Amount != null ? `R$ ${formatNumber(String(row.Amount))}` : '—'}
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-slate-100 font-medium whitespace-nowrap max-w-[200px] truncate" title={row.Description ?? ''}>
                                        {row.Description ?? '—'}
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-slate-400 text-center whitespace-nowrap">
                                        {row.PaymentMethod?.Description ?? '—'}
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-slate-400 text-center whitespace-nowrap">
                                        {formatDate(row.TransactionDate)}
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-center whitespace-nowrap">
                                        {group ? <GroupBadge group={group} /> : '—'}
                                    </TableCell>
                                    <TableCell className="px-4 py-2.5 text-center whitespace-nowrap">
                                        {row.Status ? <StatusBadge status={row.Status} /> : '—'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <TransactionMobileList
                paginated={vm.paginated}
                getAccount={getAccount}
                formatDate={formatDate}
            />

            <TransactionPaginationBar
                safePage={vm.safePage}
                pageSize={vm.pageSize}
                totalPages={vm.totalPages}
                totalItems={vm.sorted.length}
                goTo={vm.goTo}
                setPageSize={vm.setPageSize}
                setPage={vm.setPage}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {vm.isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => vm.setIsModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-xl bg-[#0f172a] border border-white/10 shadow-2xl rounded-[24px] overflow-y-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                            <h3 className="text-base font-semibold text-slate-100">{t('newTransaction')}</h3>
                            <Button
                                onClick={() => vm.setIsModalOpen(false)}
                                variant="ghost"
                                className="text-xl leading-none w-8 h-8 p-0"
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="flex-1 p-5">
                            <AddTransactionPanel
                                addTransaction={async (data) => {
                                    const result = await addTransaction(data);
                                    vm.setIsModalOpen(false);
                                    return result;
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionGrid;

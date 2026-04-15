'use client';
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { formatNumber } from "@/shared/formatNumber";
import { format, isValid, parseISO } from "date-fns";
import React, { useMemo, useState } from "react";
import AddTransactionPanel from "../Panel/AddTransactionPanel";

interface Props {
    transactions: Datum[];
    addTransaction: (data: RequestCreateTransaction) => Promise<any>;
    onGridReady?: (params: any) => void;
    onGroupBy?: (column: string) => void;
    colDefs?: any[];
}

type SortKey = 'Category' | 'Account' | 'Amount' | 'Description' | 'PaymentMethod' | 'TransactionDate' | 'Group' | 'Status';
type SortDir = 'asc' | 'desc' | null;

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100];

function formatDate(raw: any): string {
    if (!raw) return '';
    const parsed = parseISO(String(raw));
    return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : '';
}

function getAccount(row: Datum): string {
    if (row.CreditCardId) return row.CreditCard?.Name || '';
    return row.Account?.Name || '';
}

function getValue(row: Datum, key: SortKey): any {
    switch (key) {
        case 'Category': return row.Category?.Descript ?? '';
        case 'Account': return getAccount(row);
        case 'Amount': return row.Amount ?? 0;
        case 'Description': return row.Description ?? '';
        case 'PaymentMethod': return row.PaymentMethod?.Description ?? '';
        case 'TransactionDate': return row.TransactionDate ? new Date(row.TransactionDate).getTime() : 0;
        case 'Group': return row.Category?.Group?.Descript ?? '';
        case 'Status': return row.Status ?? '';
    }
}

const COLUMNS: { key: SortKey; label: string; align?: string }[] = [
    { key: 'Category', label: 'Categoria' },
    { key: 'Account', label: 'Conta', align: 'center' },
    { key: 'Amount', label: 'Valor', align: 'center' },
    { key: 'Description', label: 'Descrição' },
    { key: 'PaymentMethod', label: 'Pagamento', align: 'center' },
    { key: 'TransactionDate', label: 'Data', align: 'center' },
    { key: 'Group', label: 'Grupo', align: 'center' },
    { key: 'Status', label: 'Status', align: 'center' },
];

const GroupBadge = ({ group }: { group: string }) => (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${group === 'RECEITA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}>
        {group}
    </span>
);

const StatusBadge = ({ status }: { status: string }) => {
    const isPaid = status === 'EFETIVADA' || status === 'PAGO';
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-300'
            }`}>
            {status}
        </span>
    );
};

// ─── Input helpers ────────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const selectCls = "px-3 py-2 rounded-lg bg-[#1e293b] border border-white/10 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer";

// ─── Main component ───────────────────────────────────────────────────────────
const TransactionGrid: React.FC<Props> = ({ transactions, addTransaction }) => {
    // Sort
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [filterGroup, setFilterGroup] = useState<'ALL' | 'RECEITA' | 'DESPESA'>('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterAccount, setFilterAccount] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [amountMin, setAmountMin] = useState('');
    const [amountMax, setAmountMax] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    // Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    // ── Derived option lists ─────────────────────────────────────────────────
    const accountOptions = useMemo(() => {
        const seen = new Set<string>();
        const opts: string[] = [];
        transactions.forEach(r => {
            const a = getAccount(r);
            if (a && !seen.has(a)) { seen.add(a); opts.push(a); }
        });
        return opts.sort();
    }, [transactions]);

    const statusOptions = useMemo(() => {
        const seen = new Set<string>();
        transactions.forEach(r => { if (r.Status) seen.add(r.Status); });
        return Array.from(seen).sort();
    }, [transactions]);

    // ── Sort handler ─────────────────────────────────────────────────────────
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            if (sortDir === 'asc') { setSortDir('desc'); }
            else if (sortDir === 'desc') { setSortDir(null); setSortKey(null); }
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    // ── Filter + sort pipeline ───────────────────────────────────────────────
    const filtered = useMemo(() => {
        return transactions.filter(row => {
            // Text search
            if (search) {
                const q = search.toLowerCase();
                const hit =
                    row.Description?.toLowerCase().includes(q) ||
                    row.Category?.Descript?.toLowerCase().includes(q) ||
                    getAccount(row).toLowerCase().includes(q) ||
                    row.PaymentMethod?.Description?.toLowerCase().includes(q) ||
                    row.Status?.toLowerCase().includes(q);
                if (!hit) return false;
            }
            // Group filter (RECEITA / DESPESA)
            if (filterGroup !== 'ALL') {
                if ((row.Category?.Group?.Descript ?? '') !== filterGroup) return false;
            }
            // Status filter
            if (filterStatus !== 'ALL') {
                if (row.Status !== filterStatus) return false;
            }
            // Account filter
            if (filterAccount !== 'ALL') {
                if (getAccount(row) !== filterAccount) return false;
            }
            // Date range
            if (dateFrom || dateTo) {
                const ts = row.TransactionDate ? new Date(row.TransactionDate).getTime() : null;
                if (!ts) return false;
                if (dateFrom && ts < new Date(dateFrom).getTime()) return false;
                if (dateTo) {
                    const end = new Date(dateTo); end.setHours(23, 59, 59, 999);
                    if (ts > end.getTime()) return false;
                }
            }
            // Amount range
            const amt = row.Amount ?? 0;
            if (amountMin && amt < parseFloat(amountMin)) return false;
            if (amountMax && amt > parseFloat(amountMax)) return false;

            return true;
        });
    }, [transactions, search, filterGroup, filterStatus, filterAccount, dateFrom, dateTo, amountMin, amountMax]);

    const sorted = useMemo(() => {
        if (!sortKey || !sortDir) return filtered;
        return [...filtered].sort((a, b) => {
            const va = getValue(a, sortKey);
            const vb = getValue(b, sortKey);
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filtered, sortKey, sortDir]);

    // ── Pagination ───────────────────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

    // Reset to page 1 whenever filters/sort/size change
    const resetPage = () => setPage(1);

    // Active filter count badge
    const activeFilters = [
        filterGroup !== 'ALL',
        filterStatus !== 'ALL',
        filterAccount !== 'ALL',
        !!dateFrom || !!dateTo,
        !!amountMin || !!amountMax,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setFilterGroup('ALL');
        setFilterStatus('ALL');
        setFilterAccount('ALL');
        setDateFrom('');
        setDateTo('');
        setAmountMin('');
        setAmountMax('');
        setSearch('');
        resetPage();
    };

    // ── Summaries ────────────────────────────────────────────────────────────
    const totalReceita = filtered.filter(r => r.Category?.Group?.Descript === 'RECEITA').reduce((s, r) => s + (r.Amount ?? 0), 0);
    const totalDespesa = filtered.filter(r => r.Category?.Group?.Descript === 'DESPESA').reduce((s, r) => s + (r.Amount ?? 0), 0);

    // ── Sort icon ────────────────────────────────────────────────────────────
    const SortIcon = ({ col }: { col: SortKey }) => {
        if (sortKey !== col) return <span className="ml-1 opacity-25 text-xs">↕</span>;
        return <span className="ml-1 text-indigo-400 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="relative flex flex-col gap-3 w-full">

            {/* ── Toolbar ── */}
            <div className="flex items-center gap-3 flex-wrap justify-between">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Buscar transação..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); resetPage(); }}
                        className="flex-1 min-w-[180px] max-w-xs px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    {/* Filter toggle */}
                    <button
                        onClick={() => setFiltersOpen(v => !v)}
                        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${filtersOpen || activeFilters > 0
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 01.707 1.707L13 9.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-7.586L3.293 5.707A1 1 0 013 5V3z" clipRule="evenodd" />
                        </svg>
                        Filtros
                        {activeFilters > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
                                {activeFilters}
                            </span>
                        )}
                    </button>

                    {activeFilters > 0 && (
                        <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-rose-400 transition-colors underline underline-offset-2">
                            Limpar filtros
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <span className="text-lg leading-none">+</span>
                    Nova Transação
                </button>
            </div>

            {/* ── Filter Panel ── */}
            {filtersOpen && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 p-4 rounded-xl bg-[#0f172a] border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Group */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tipo</label>
                        <select value={filterGroup} onChange={e => { setFilterGroup(e.target.value as any); resetPage(); }} className={selectCls}>
                            <option value="ALL">Todos</option>
                            <option value="RECEITA">Receita</option>
                            <option value="DESPESA">Despesa</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</label>
                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); resetPage(); }} className={selectCls}>
                            <option value="ALL">Todos</option>
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Account */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Conta</label>
                        <select value={filterAccount} onChange={e => { setFilterAccount(e.target.value); resetPage(); }} className={selectCls}>
                            <option value="ALL">Todas</option>
                            {accountOptions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>

                    {/* Date from */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Data de</label>
                        <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); resetPage(); }} className={inputCls} />
                    </div>

                    {/* Date to */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Data até</label>
                        <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); resetPage(); }} className={inputCls} />
                    </div>

                    {/* Amount min */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Valor mín.</label>
                        <input type="number" min={0} step="0.01" placeholder="0,00" value={amountMin} onChange={e => { setAmountMin(e.target.value); resetPage(); }} className={inputCls} />
                    </div>

                    {/* Amount max */}
                    <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Valor máx.</label>
                        <input type="number" min={0} step="0.01" placeholder="9999,00" value={amountMax} onChange={e => { setAmountMax(e.target.value); resetPage(); }} className={inputCls} />
                    </div>
                </div>
            )}

            {/* ── Summary badges ── */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Receita</span>
                    <span className="text-sm font-semibold text-emerald-400">R$ {formatNumber(String(totalReceita))}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Despesa</span>
                    <span className="text-sm font-semibold text-rose-400">R$ {formatNumber(String(totalDespesa))}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Saldo</span>
                    <span className={`text-sm font-semibold ${totalReceita - totalDespesa >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        R$ {formatNumber(String(totalReceita - totalDespesa))}
                    </span>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-[#111827] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                            {COLUMNS.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className={`px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-slate-200 transition-colors ${col.align === 'center' ? 'text-center' : ''}`}
                                >
                                    {col.label}<SortIcon col={col.key} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-slate-500 text-sm">
                                    Nenhuma transação encontrada.
                                </td>
                            </tr>
                        ) : paginated.map((row, i) => {
                            const group = row.Category?.Group?.Descript ?? '';
                            const amountColor = group === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400';
                            return (
                                <tr key={row.Id ?? i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                    <td className="px-4 py-2.5 text-slate-400 font-medium whitespace-nowrap">
                                        {row.Category?.Descript ?? '—'}
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-400 text-center whitespace-nowrap">
                                        {getAccount(row) || '—'}
                                    </td>
                                    <td className={`px-4 py-2.5 text-center font-semibold whitespace-nowrap ${amountColor}`}>
                                        {row.Amount != null ? `R$ ${formatNumber(String(row.Amount))}` : '—'}
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-100 font-medium whitespace-nowrap max-w-[200px] truncate" title={row.Description ?? ''}>
                                        {row.Description ?? '—'}
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-400 text-center whitespace-nowrap">
                                        {row.PaymentMethod?.Description ?? '—'}
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-400 text-center whitespace-nowrap">
                                        {formatDate(row.TransactionDate as any)}
                                    </td>
                                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                        {group ? <GroupBadge group={group} /> : '—'}
                                    </td>
                                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                        {row.Status ? <StatusBadge status={row.Status} /> : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination bar ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Left: count info */}
                <p className="text-xs text-slate-500">
                    Mostrando{' '}
                    <span className="text-slate-300 font-medium">
                        {sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)}
                    </span>{' '}
                    de{' '}
                    <span className="text-slate-300 font-medium">{sorted.length}</span>{' '}
                    transações
                </p>

                {/* Center: page buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => goTo(1)}
                        disabled={safePage === 1}
                        className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Primeira página"
                    >
                        ««
                    </button>
                    <button
                        onClick={() => goTo(safePage - 1)}
                        disabled={safePage === 1}
                        className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        ‹ Anterior
                    </button>

                    {/* Page number pills */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                        .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, i) =>
                            p === '…'
                                ? <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-600">…</span>
                                : <button
                                    key={p}
                                    onClick={() => goTo(p as number)}
                                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${safePage === p
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {p}
                                </button>
                        )
                    }

                    <button
                        onClick={() => goTo(safePage + 1)}
                        disabled={safePage === totalPages}
                        className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Próximo ›
                    </button>
                    <button
                        onClick={() => goTo(totalPages)}
                        disabled={safePage === totalPages}
                        className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Última página"
                    >
                        »»
                    </button>
                </div>

                {/* Right: page size */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Linhas por página:</span>
                    <select
                        value={pageSize}
                        onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                        className="px-2 py-1 rounded bg-[#1e293b] border border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                    >
                        {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* ── Drawer ── */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                    <div className="relative z-10 w-full max-w-sm h-full bg-[#0f172a] border-l border-white/10 shadow-2xl overflow-y-auto flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                            <h3 className="text-base font-semibold text-slate-100">Nova Transação</h3>
                            <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
                        </div>
                        <div className="flex-1 p-5">
                            <AddTransactionPanel
                                addTransaction={async (data) => {
                                    const result = await addTransaction(data);
                                    setDrawerOpen(false);
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

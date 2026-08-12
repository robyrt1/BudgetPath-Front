import { useState, useMemo } from "react";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { parseISO, isValid, format } from "date-fns";

export type SortKey = 'Category' | 'Account' | 'Amount' | 'Description' | 'PaymentMethod' | 'TransactionDate' | 'Group' | 'Status';
export type SortDir = 'asc' | 'desc' | null;

export function getAccount(row: Datum): string {
    if (row.CreditCardId) return row.CreditCard?.Name || '';
    return row.Account?.Name || '';
}

export function formatDate(raw: string | number | Date | null | undefined): string {
    if (!raw) return '';
    const parsed = parseISO(String(raw));
    return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : '';
}

function getValue(row: Datum, key: SortKey): string | number {
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

export const useTransactionGridViewModel = (transactions: Datum[]) => {
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

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Derived Option Lists
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

    // Sort Handler
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            if (sortDir === 'asc') { setSortDir('desc'); }
            else if (sortDir === 'desc') { setSortDir(null); setSortKey(null); }
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    // Filter + Sort pipeline
    const filtered = useMemo(() => {
        return transactions.filter(row => {
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
            if (filterGroup !== 'ALL') {
                if ((row.Category?.Group?.Descript ?? '') !== filterGroup) return false;
            }
            if (filterStatus !== 'ALL') {
                if (row.Status !== filterStatus) return false;
            }
            if (filterAccount !== 'ALL') {
                if (getAccount(row) !== filterAccount) return false;
            }
            if (dateFrom || dateTo) {
                const ts = row.TransactionDate ? new Date(row.TransactionDate).getTime() : null;
                if (!ts) return false;
                if (dateFrom && ts < new Date(dateFrom).getTime()) return false;
                if (dateTo) {
                    const end = new Date(dateTo); end.setHours(23, 59, 59, 999);
                    if (ts > end.getTime()) return false;
                }
            }
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

    // Pagination Calculations
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
    const resetPage = () => setPage(1);

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

    // Summaries
    const totalReceita = filtered.filter(r => r.Category?.Group?.Descript === 'RECEITA').reduce((s, r) => s + (r.Amount ?? 0), 0);
    const totalDespesa = filtered.filter(r => r.Category?.Group?.Descript === 'DESPESA').reduce((s, r) => s + (r.Amount ?? 0), 0);

    return {
        sortKey,
        sortDir,
        search,
        setSearch,
        filterGroup,
        setFilterGroup,
        filterStatus,
        setFilterStatus,
        filterAccount,
        setFilterAccount,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        amountMin,
        setAmountMin,
        amountMax,
        setAmountMax,
        filtersOpen,
        setFiltersOpen,
        page,
        setPage,
        pageSize,
        setPageSize,
        isModalOpen,
        setIsModalOpen,
        accountOptions,
        statusOptions,
        handleSort,
        sorted,
        totalPages,
        safePage,
        paginated,
        goTo,
        resetPage,
        activeFilters,
        clearFilters,
        totalReceita,
        totalDespesa
    };
};

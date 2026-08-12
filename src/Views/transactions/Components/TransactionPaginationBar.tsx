import React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

interface TransactionPaginationBarProps {
    safePage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    goTo: (page: number) => void;
    setPageSize: (size: number) => void;
    setPage: (page: number) => void;
    pageSizeOptions: number[];
}

export const TransactionPaginationBar: React.FC<TransactionPaginationBarProps> = ({
    safePage,
    pageSize,
    totalPages,
    totalItems,
    goTo,
    setPageSize,
    setPage,
    pageSizeOptions
}) => {
    const t = useTranslations('transactions');

    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-slate-500">
                {t('showing')}{' '}
                <span className="text-slate-300 font-medium">
                    {totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, totalItems)}
                </span>{' '}
                {t('of')}{' '}
                <span className="text-slate-300 font-medium">{totalItems}</span>{' '}
                {t('title').toLowerCase()}
            </p>

            <div className="flex items-center gap-1">
                <Button
                    onClick={() => goTo(1)}
                    disabled={safePage === 1}
                    variant="ghost"
                    size="sm"
                    className="disabled:opacity-30"
                    title={t('firstPage')}
                >
                    ««
                </Button>
                <Button
                    onClick={() => goTo(safePage - 1)}
                    disabled={safePage === 1}
                    variant="ghost"
                    size="sm"
                    className="disabled:opacity-30"
                >
                    {t('previous')}
                </Button>

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
                            : <Button
                                key={p}
                                onClick={() => goTo(p as number)}
                                variant={safePage === p ? "primary" : "ghost"}
                                className="w-7 h-7 p-0 text-xs font-medium"
                            >
                                {p}
                            </Button>
                    )
                }

                <Button
                    onClick={() => goTo(safePage + 1)}
                    disabled={safePage === totalPages}
                    variant="ghost"
                    size="sm"
                    className="disabled:opacity-30"
                >
                    {t('next')}
                </Button>
                <Button
                    onClick={() => goTo(totalPages)}
                    disabled={safePage === totalPages}
                    variant="ghost"
                    size="sm"
                    className="disabled:opacity-30"
                    title={t('lastPage')}
                >
                    »»
                </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{t('rowsPerPage')}</span>
                <div className="w-20">
                    <Select.Root value={String(pageSize)} onChange={val => { setPageSize(Number(val)); setPage(1); }}>
                        <Select.Trigger displayValue={String(pageSize)} />
                        <Select.Content direction="up">
                            {pageSizeOptions.map(s => (
                                <Select.Option key={s} value={String(s)}>{s}</Select.Option>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>
        </div>
    );
};

export default TransactionPaginationBar;

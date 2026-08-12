import React from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface TransactionToolbarProps {
    search: string;
    setSearch: (val: string) => void;
    filtersOpen: boolean;
    setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
    activeFilters: number;
    clearFilters: () => void;
    resetPage: () => void;
    setIsModalOpen: (val: boolean) => void;
}

export const TransactionToolbar: React.FC<TransactionToolbarProps> = ({
    search,
    setSearch,
    filtersOpen,
    setFiltersOpen,
    activeFilters,
    clearFilters,
    resetPage,
    setIsModalOpen,
}) => {
    const t = useTranslations('transactions');

    return (
        <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
                <Input.Field
                    type="text"
                    placeholder={t('search')}
                    value={search}
                    onChange={e => { setSearch(e.target.value); resetPage(); }}
                    className="flex-1 min-w-[180px] max-w-xs"
                />

                <Button
                    onClick={() => setFiltersOpen(v => !v)}
                    variant="secondary"
                    className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${filtersOpen || activeFilters > 0
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/30'
                        : ''
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 01.707 1.707L13 9.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-7.586L3.293 5.707A1 1 0 013 5V3z" clipRule="evenodd" />
                    </svg>
                    {t('filters')}
                    {activeFilters > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
                            {activeFilters}
                        </span>
                    )}
                </Button>

                {activeFilters > 0 && (
                    <Button
                        onClick={clearFilters}
                        variant="ghost"
                        className="text-xs text-slate-500 hover:text-rose-400 transition-colors underline underline-offset-2 px-2 py-1 h-auto"
                    >
                        {t('clearFilters')}
                    </Button>
                )}
            </div>

            <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                className="fixed bottom-6 right-6 z-50 md:static flex items-center justify-center md:justify-start gap-2 w-14 h-14 md:w-auto md:h-auto px-0 md:px-4 py-0 md:py-2 rounded-full md:rounded-lg"
            >
                <span className="text-xl md:text-lg leading-none">+</span>
                <span className="hidden md:inline">{t('newTransaction')}</span>
            </Button>
        </div>
    );
};

export default TransactionToolbar;

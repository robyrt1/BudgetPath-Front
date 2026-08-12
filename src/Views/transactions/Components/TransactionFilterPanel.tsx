import React from "react";
import { useTranslations } from "next-intl";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

interface TransactionFilterPanelProps {
    filterGroup: 'ALL' | 'RECEITA' | 'DESPESA';
    setFilterGroup: (val: 'ALL' | 'RECEITA' | 'DESPESA') => void;
    filterStatus: string;
    setFilterStatus: (val: string) => void;
    filterAccount: string;
    setFilterAccount: (val: string) => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;
    amountMin: string;
    setAmountMin: (val: string) => void;
    amountMax: string;
    setAmountMax: (val: string) => void;
    statusOptions: string[];
    accountOptions: string[];
    resetPage: () => void;
}

export const TransactionFilterPanel: React.FC<TransactionFilterPanelProps> = ({
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
    statusOptions,
    accountOptions,
    resetPage
}) => {
    const t = useTranslations('transactions');

    const groupLabels: Record<string, string> = {
        ALL: t('filterLabels.all'),
        RECEITA: t('summary.income'),
        DESPESA: t('summary.expense')
    };

    const displayStatus = filterStatus === 'ALL' ? t('filterLabels.all') : filterStatus;
    const displayAccount = filterAccount === 'ALL' ? t('filterLabels.allAccounts') : filterAccount;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 p-4 rounded-xl bg-[#0f172a] border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Group Type Select */}
            <div className="flex flex-col gap-1 w-full justify-end">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">{t('filterLabels.type')}</label>
                <Select.Root value={filterGroup} onChange={(val) => { setFilterGroup(val as 'ALL' | 'RECEITA' | 'DESPESA'); resetPage(); }}>
                    <Select.Trigger displayValue={groupLabels[filterGroup]} />
                    <Select.Content>
                        <Select.Option value="ALL">{t('filterLabels.all')}</Select.Option>
                        <Select.Option value="RECEITA">{t('summary.income')}</Select.Option>
                        <Select.Option value="DESPESA">{t('summary.expense')}</Select.Option>
                    </Select.Content>
                </Select.Root>
            </div>

            {/* Status Select */}
            <div className="flex flex-col gap-1 w-full justify-end">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">{t('filterLabels.status')}</label>
                <Select.Root value={filterStatus} onChange={(val) => { setFilterStatus(val); resetPage(); }}>
                    <Select.Trigger displayValue={displayStatus} />
                    <Select.Content>
                        <Select.Option value="ALL">{t('filterLabels.all')}</Select.Option>
                        {statusOptions.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                    </Select.Content>
                </Select.Root>
            </div>

            {/* Account Select */}
            <div className="flex flex-col gap-1 w-full justify-end">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">{t('filterLabels.account')}</label>
                <Select.Root value={filterAccount} onChange={(val) => { setFilterAccount(val); resetPage(); }}>
                    <Select.Trigger displayValue={displayAccount} />
                    <Select.Content>
                        <Select.Option value="ALL">{t('filterLabels.allAccounts')}</Select.Option>
                        {accountOptions.map(a => <Select.Option key={a} value={a}>{a}</Select.Option>)}
                    </Select.Content>
                </Select.Root>
            </div>

            {/* Date From */}
            <Input.Root>
                <Input.Label>{t('filterLabels.dateFrom')}</Input.Label>
                <Input.Field 
                    type="date" 
                    value={dateFrom} 
                    onChange={e => { setDateFrom(e.target.value); resetPage(); }} 
                    className="cursor-pointer" 
                />
            </Input.Root>

            {/* Date To */}
            <Input.Root>
                <Input.Label>{t('filterLabels.dateTo')}</Input.Label>
                <Input.Field 
                    type="date" 
                    value={dateTo} 
                    onChange={e => { setDateTo(e.target.value); resetPage(); }} 
                    className="cursor-pointer" 
                />
            </Input.Root>

            {/* Amount Min */}
            <Input.Root>
                <Input.Label>{t('filterLabels.amountMin')}</Input.Label>
                <Input.Field 
                    type="number" 
                    min={0} 
                    step="0.01" 
                    placeholder="0,00" 
                    value={amountMin} 
                    onChange={e => { setAmountMin(e.target.value); resetPage(); }} 
                />
            </Input.Root>

            {/* Amount Max */}
            <Input.Root className="col-span-2 md:col-span-1">
                <Input.Label>{t('filterLabels.amountMax')}</Input.Label>
                <Input.Field 
                    type="number" 
                    min={0} 
                    step="0.01" 
                    placeholder="9999,00" 
                    value={amountMax} 
                    onChange={e => { setAmountMax(e.target.value); resetPage(); }} 
                />
            </Input.Root>
        </div>
    );
};

export default TransactionFilterPanel;

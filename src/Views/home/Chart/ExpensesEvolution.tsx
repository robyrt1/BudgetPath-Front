import { Datum } from '@/Models/Transactions/Responses/ResponseTransacrions';
import { AuthState } from '@/Redux/Slices/AutheticationSlice';
import UseAggregatedExpensesViewModel from '@/ViewModels/Transactions/AggregatedExpensesViewModel';
import { ITransformExpenseDataResponse } from '@/ViewModels/Transactions/Types/FindTransactionsType';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const groupByKey = {
    month: 'Month',
    week: 'Week',
    year: 'Year'
}

export default function ExpensesEvolution({ showBalances, transactionsProp }: { showBalances?: boolean, transactionsProp?: Datum[] }) {
    const t = useTranslations('home.expensesEvolution');
    const [groupBy, setgroupBy] = useState<string>(groupByKey.month);
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const [filtro, setFiltro] = useState<string>(groupByKey.month);

    const { data: DataAggregateExpenses, transformExpensesData, getAccountColor, find } = UseAggregatedExpensesViewModel({ groupBy, userId });

    useEffect(() => {
        if (!userId || !groupBy) return;
        find()
    }, [userId, groupBy]);

    const transformedData = transformExpensesData(DataAggregateExpenses);
    const tooltipFormatter = (value: number) => showBalances ? `R$ ${value.toFixed(2)}` : 'R$ ****';
    const renderAreas = (data: ITransformExpenseDataResponse[]) => {
        return Object.keys(data[0] || {})
            .filter(key => key !== 'period')
            .map((account, idx) => (
                <Area
                    key={account}
                    type="monotone"
                    dataKey={account}
                    strokeWidth={3}
                    stroke={getAccountColor(idx)}
                    fillOpacity={1}
                    fill={`url(#color${idx})`}
                    name={account}
                />
            ));
    };


    return (
        <div className="rounded-2xl border border-white/5 bg-[#111827] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 mt-6 w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-100">📊 {t('title')}</h2>
                <div className="flex gap-2">
                    {(Object.values(groupByKey)).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setgroupBy(f), setFiltro(f) }}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors shadow-sm ${filtro === f
                                ? 'bg-[#3B82F6] text-white shadow-[#3B82F6]/30'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                                }`}
                        >
                            {t(`summary.${f.toLowerCase()}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    {DataAggregateExpenses.length === 0 ? (
                        <p className="text-gray-500">{t('noResults')}</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    {Object.keys(transformedData[0] || {}).filter(key => key !== 'period').map((account, idx) => (
                                        <linearGradient key={`color${idx}`} id={`color${idx}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={getAccountColor(idx)} stopOpacity={0.4} />
                                            <stop offset="95%" stopColor={getAccountColor(idx)} stopOpacity={0} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                                <XAxis dataKey="period" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0A0F1C",
                                        borderColor: "rgba(255,255,255,0.1)",
                                        color: "#f1f5f9",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                                    }}
                                    itemStyle={{ color: "#f1f5f9" }}
                                    formatter={tooltipFormatter} />
                                {
                                    renderAreas(transformedData)
                                }
                            </AreaChart>
                        </ResponsiveContainer>

                    )}
                </div>

                <div className="w-full lg:w-[400px] bg-[#1A2235] border border-white/5 rounded-xl p-6 shadow-md flex mx-auto flex-col">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 tracking-tight">📄 {t('summary.title')} {t('summary.' + filtro.toLowerCase())}</h3>
                    <ul className="divide-y divide-white/5 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1E293B] hover:scrollbar-thumb-[#334155] scrollbar-track-transparent">
                        {DataAggregateExpenses.map((item, index) => (
                            <li
                                key={index}
                                className="flex flex-col sm:grid sm:grid-cols-[35%_25%_25%] gap-1 sm:gap-4 py-3 text-sm transition-colors hover:bg-white/5 rounded-lg px-2"
                            >
                                <span className="text-slate-300 capitalize sm:col-span-1">{item.account}</span>
                                <span className="text-slate-400 capitalize sm:col-span-1">{item.period}</span>
                                <span className="font-semibold text-slate-100 sm:text-right sm:col-span-1">
                                    {showBalances
                                        ? `R$ ${item.total.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 2,
                                        })}`
                                        : 'R$ ****'}
                                </span>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>

    );
}

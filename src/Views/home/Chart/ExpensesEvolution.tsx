import { Datum } from '@/Models/Transactions/Responses/ResponseTransacrions';
import { AuthState } from '@/Redux/Slices/AutheticationSlice';
import UseAggregatedExpensesViewModel from '@/ViewModels/Transactions/AggregatedExpensesViewModel';
import { ITransformExpenseDataResponse } from '@/ViewModels/Transactions/Types/FindTransactionsType';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const groupByKey = {
    month: 'Month',
    week: 'Week',
    year: 'Year'
}

export default function ExpensesEvolution({ showBalances, transactionsProp }: { showBalances?: boolean, transactionsProp?: Datum[] }) {
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
    const renderLines = (data: ITransformExpenseDataResponse[]) => {
        return Object.keys(data[0] || {})
            .filter(key => key !== 'period')
            .map((account, idx) => (
                <Line
                    key={account}
                    type="monotone"
                    dataKey={account}
                    strokeWidth={2}
                    stroke={getAccountColor(idx)}
                    name={account}
                />
            ));
    };


    return (
        <div className="p-6 rounded-xl shadow-md mt-6 w-full" style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid #2f365f"
        }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-100">📊 Expense Evolution</h2>
                <div className="flex gap-2">
                    {(Object.values(groupByKey)).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setgroupBy(f), setFiltro(f) }}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${filtro === f
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    {DataAggregateExpenses.length === 0 ? (
                        <p className="text-gray-500">Nenhuma despesa encontrada.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={transformedData} >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--background)",
                                        borderColor: "#2f365f",
                                        color: "var(--foreground)",
                                    }}
                                    formatter={tooltipFormatter} />
                                {
                                    renderLines(transformedData)
                                }
                            </LineChart>
                        </ResponsiveContainer>

                    )}
                </div>

                <div className="w-full lg:w-[400px] bg-gray-50 rounded-xl p-4 shadow-inner" style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid #2f365f"
                }}>
                    <h3 className="text-lg font-semibold text-gray-100 mb-3">📄 Summary by {filtro}</h3>
                    <ul className="divide-y divide-gray-200 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 scrollbar-track-gray-100">
                        {DataAggregateExpenses.map((item, index) => (
                            <li
                                key={index}
                                className="flex flex-col sm:grid sm:grid-cols-[35%_25%_25%] gap-1 sm:gap-4 py-2 text-sm"
                            >
                                <span className="text-gray-100 capitalize sm:col-span-1">{item.account}</span>
                                <span className="text-gray-100 capitalize sm:col-span-1">{item.period}</span>
                                <span className="font-semibold text-gray-150 sm:text-right sm:col-span-1">
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

import { Datum } from '@/Models/Transactions/Responses/ResponseTransacrions';
import { AuthState } from '@/Redux/Slices/AutheticationSlice';
import UseFindTransactionViewModel from '@/ViewModels/Transactions/TransactionsViewModel';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Agrupamento = 'month' | 'week' | 'year';

interface PontoEvolucao {
    data: string;
    total: number;
}

const optionsFiltro = {
    month: 'month',
    week: 'week',
    year: 'year'
}

export default function ExpensesEvolution({ showBalances, transactionsProp }: { showBalances?: boolean, transactionsProp?: Datum[] }) {
    const [transactions, setTransactions] = useState<Datum[]>([]);
    const [data, setData] = useState<PontoEvolucao[]>([]);
    const [resumo, setResumo] = useState<PontoEvolucao[]>([]);
    const [filtro, setFiltro] = useState<Agrupamento>('month');
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { find } = UseFindTransactionViewModel({ UserId: userId });

    useEffect(() => {
        if (!userId) return;

        const fetchTransactions = async () => {
            try {
                const response = await find({ top: 1000 });
                const transacoes = response.Data || [];
                setTransactions(transacoes);
            } catch (err) {
            }
        };

        if (transactionsProp) {
            setTransactions(transactionsProp);
            return;
        }

        fetchTransactions();
    }, [userId]);

    useEffect(() => {
        if (!transactions.length) return;

        const despesas = transactions.filter(
            (t) => t.Category?.Group?.Descript === 'DESPESA'
        );

        const agrupado: Record<string, number> = {};

        despesas.forEach((t) => {
            const date = new Date(t.TransactionDate);
            let chave = '';

            if (filtro === 'month') {
                chave = date.toLocaleDateString('pt-BR', { month: 'long', year: '2-digit' });
            } else if (filtro === 'year') {
                chave = `${date.getFullYear()}`;
            } else if (filtro === 'week') {
                const inicioSemana = new Date(date.setDate(date.getDate() - date.getDay()));
                chave = `week de ${inicioSemana.toLocaleDateString('pt-BR')}`;
            }

            agrupado[chave] = (agrupado[chave] || 0) + t.Amount;
        });

        const agrupadoFinal: PontoEvolucao[] = Object.entries(agrupado).map(([data, total]) => ({
            data,
            total: Number(total.toFixed(2)),
        }));

        setData(agrupadoFinal);
        setResumo(agrupadoFinal);
    }, [filtro, transactions]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-700">📊 Expense Evolution</h2>
                <div className="flex gap-2">
                    {(['month', 'week', 'year'] as Agrupamento[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${filtro === f
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {f === 'month' ? 'Months' : f === 'week' ? 'Weeks' : 'Year'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    {data.length === 0 ? (
                        <p className="text-gray-500">Nenhuma despesa encontrada.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="data" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => showBalances ? `R$ ${value.toFixed(2)}` : 'R$ ****'} />
                                <Line type="monotone" dataKey="total" stroke="#f87171" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="w-full lg:w-[300px] bg-gray-50 rounded-xl p-4 shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">📄 Summary by {filtro}</h3>
                    <ul className="divide-y divide-gray-200">
                        {resumo.map((item, index) => (
                            <li key={index} className="flex justify-between py-2 text-sm">
                                <span className="text-gray-700 capitalize">{item.data}</span>
                                <span className="font-semibold text-gray-900">
                                    {showBalances
                                        ? `R$ ${item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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

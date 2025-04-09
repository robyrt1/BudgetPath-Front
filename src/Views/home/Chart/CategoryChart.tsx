import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import _ from "lodash";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Props = {
    transactions: Datum[];
    showBalances?: boolean
};

const COLORS = [
    "#f87171", "#fb923c", "#facc15", "#34d399", "#60a5fa", "#a78bfa", "#f472b6", "#2dd4bf"
];

const CategoryChart = ({ transactions, showBalances }: Props) => {
    const grouped = _.groupBy(transactions, (t) => t.Category?.Descript || "Sem Categoria");

    const data = Object.entries(grouped).map(([category, group]) => ({
        category,
        total: _.sumBy(group, "Amount"),
    }));

    return (
        <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-2">Expense by category</h3>
            <ResponsiveContainer width={500} height={300}>
                <BarChart layout="vertical" data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => showBalances ? `R$ ${value.toFixed(2)}` : 'R$ ***'} />
                    <Bar dataKey="total">
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryChart;

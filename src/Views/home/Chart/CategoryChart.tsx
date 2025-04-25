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
        Total: _.sumBy(group, "Amount"),
    }));

    return (
        <div
            className="rounded-xl shadow-md p-4 w-full max-w-xl"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid #2f365f"
            }}
        >
            <h3 className="text-lg font-semibold mb-2">Expense by category</h3>
            <ResponsiveContainer width={500} height={300}>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        stroke="var(--foreground)"
                        tick={{ fontSize: 12, fill: "var(--foreground)" }}
                    />
                    <YAxis
                        type="category"
                        dataKey="category"
                        width={120}
                        tick={{ fontSize: 12, fill: "var(--foreground)" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fb923c",
                            borderColor: "#2f365f",
                            color: "var(--foreground)",
                        }}
                        formatter={(value: number) =>
                            showBalances ? `R$ ${value.toFixed(2)}` : "R$ ***"
                        }
                    />
                    <Bar dataKey="Total">
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

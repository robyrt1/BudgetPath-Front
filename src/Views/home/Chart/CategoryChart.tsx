import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import _ from "lodash";
import { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    showBalances?: boolean;
    year: number
    month: number
    setYear?: Dispatch<SetStateAction<number>>
    setMonth?: Dispatch<SetStateAction<number>>
};

const COLORS = [
    "#f87171", "#fb923c", "#facc15", "#34d399", "#60a5fa", "#a78bfa", "#f472b6", "#2dd4bf"
];

const CategoryChart = ({ transactions, showBalances, setYear, setMonth, year, month }: Props) => {

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
            <section className="flex justify-start mb-2">
                <h3 className="text-lg font-semibold mb-2 mr-2">Expense by category</h3>
                <DatePicker
                    selected={new Date(year, month - 1)}
                    onChange={(date: Date | null) => {
                        if (!date) return;
                        setYear?.(date.getFullYear());
                        setMonth?.(date.getMonth() + 1);

                    }}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    className="bg-gray-800 text-sm text-white px-2 py-1 rounded w-[90px] text-center"
                />
            </section>
            {data.length <= 0 ? (
                <p className="text-gray-500">Nenhuma despesa encontrada.</p>
            ) : (
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
            )}

        </div>
    );
};

export default CategoryChart;

import { ResponseAggregatedExpenses } from "@/Models/Transactions/Responses/ResponseAggregatedExpenses";
import TransactionsModel from "@/Models/Transactions/TransactionsModel";
import { useState } from "react";
import { IAggregatedExpenses, IAggregatedExpensesProps, ITransformExpenseDataRequest } from "./Types/FindTransactionsType";

const UseAggregatedExpensesViewModel = ({ groupBy, userId }: IAggregatedExpensesProps): IAggregatedExpenses => {
    const [data, setData] = useState<ResponseAggregatedExpenses[]>([])
    const [error, SetError] = useState<any>(null);

    function getAccountColor(index: number): string {
        const hue = (index * 57) % 360; // Distribui bem as cores na roda
        return `hsl(${hue}, 70%, 60%)`; // Saturado e claro o suficiente pro dark mode
    }

    function transformExpensesData(data: ITransformExpenseDataRequest[]) {
        const grouped: Record<string, any> = {};

        data.forEach(({ account, period, total }) => {
            if (!grouped[period]) {
                grouped[period] = { period };
            }
            grouped[period][account] = total;
        });

        const parseDate = (period: string) => {
            const dateRangeMatch = period.match(/(\d{2})\s*a\s*(\d{2})\/(\d{2})\/(\d{4})/);
            if (dateRangeMatch) {
                const [, startDayStr, endDayStr, monthStr, yearStr] = dateRangeMatch;
                let startDay = parseInt(startDayStr, 10);
                const endDay = parseInt(endDayStr, 10);
                let month = parseInt(monthStr, 10);
                const year = parseInt(yearStr, 10);

                if (startDay > endDay) {
                    month = month - 1;
                    if (month === 0) {
                        month = 12;
                    }
                }

                const date = new Date(year, month - 1, startDay);
                return date;
            }
            const monthYearMatch = period.match(/(\d{2})\/(\d{4})/);
            if (monthYearMatch) {
                const [, month, year] = monthYearMatch;
                return new Date(`${month}/01/${year}`);
            }

            const yearMatch = period.match(/(\d{4})/);
            if (yearMatch) {
                const [, year] = yearMatch;
                return new Date(`${year}-01-01`);
            }
            return new Date(0);
        };

        const sortedGrouped = Object.values(grouped).sort((a, b) => parseDate(a.period).getTime() - parseDate(b.period).getTime());

        return sortedGrouped;
    }
    return {
        data,
        error,
        find: async () => {
            try {
                const response = await TransactionsModel.AggregatedExpenses({ groupBy, userId });
                setData(response);
                return response;
            } catch (error) {
                SetError(String(error))
                return []
            }

        },
        transformExpensesData,
        getAccountColor
    }
}

export default UseAggregatedExpensesViewModel
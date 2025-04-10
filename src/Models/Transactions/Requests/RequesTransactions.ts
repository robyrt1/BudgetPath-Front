export type RequestTransactions = {
    userId: string;
    accountId?: string;
    category?: string;
    top?: number;
    group?: string
}

export type RequestCreateTransaction = {
    userId: string;
    accountId: string | null;
    creditCardId: string | null;
    debtId: string | null;
    installmentId: string | null;
    categoryId: string;
    description: string;
    amount: number;
    transactionDate: string; // ISO 8601 date-time string
    paymentMethod: string;
}

export type RequestAggregatedExpenses = {
    userId: string; groupBy: string
}
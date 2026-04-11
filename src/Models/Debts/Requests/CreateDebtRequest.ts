export interface CreateDebtRequest {
    userId: string;
    accountId: string;
    creditCardId?: string | null;
    categoryId: string;
    description: string;
    totalAmount: number;
    installments: number;
    dueDate: string;
}

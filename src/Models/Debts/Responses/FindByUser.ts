export interface ResponseDebts {
    pageNumber: number;
    pageSize: number;
    firstPage: null;
    lastPage: null;
    totalPages: number;
    totalRecords: number;
    nextPage: null;
    previousPage: null;
    data: Debts[];
    succeeded: boolean;
    errors: null;
    message: null;
}

export interface Debts {
    id: string;
    userId: string;
    accountId: string;
    creditCardId: null;
    categoryId: string;
    description: string;
    totalAmount: number;
    installments: number;
    paidAmount: number;
    remainingAmount: number;
    dueDate: Date;
    status: string;
    createdAt: Date;
    user: null;
    account: Account;
    creditCard: null;
    category: Category;
    debtInstallments: null;
}

export interface Account {
    id: string;
    userId: string;
    name: string;
    balance: number;
    createAt: Date;
    user: null;
    creditCard: null;
}

export interface Category {
    id: string;
    descript: string;
    groupId: string;
    userId: null | string;
    parentId: null | string;
    group: null;
    subCategories: null;
}

export interface ResponseTransactions {
    Data: Datum[];
    PageNumber: number;
    PageSize: number;
    TotalPages: number;
    TotalRecords: number;
    Succeeded: boolean;
    Errors: null;
    Message: null;
}

export interface Datum {
    Account: Account;
    CreditCard: CreditCard,
    User: User;
    DebtInstallment: DebtInstallment;
    Category: Category;
    Debt: Debt;
    Id: string;
    UserId: string;
    AccountId: string;
    CreditCardId: null;
    DebtId: string;
    InstallmentId: string;
    CategoryId: string;
    Description: string;
    Amount: number;
    TransactionDate: Date;
    PaymentMethodId: string;
    Status: string;
    CreatedAt: Date;
}

export interface Account {
    Id: string;
    UserId: string;
    Name: string;
    Balance: number;
    CreateAt: Date;
}

export interface CreditCard {
    Id: string;
    UserId: string;
    Name: string;
    Balance: number;
    CreateAt: Date;
}

export interface Category {
    Group: Group,
    Id: string;
    Descript: string;
    GroupId: string;
    UserId: null;
    ParentId: string;
}

export interface Group {
    Id: string,
    Descript: string,
    CREATED_AT: string

}

export interface Debt {
    Id: string;
    UserId: string;
    AccountId: string;
    CreditCardId: null;
    CategoryId: string;
    Description: string;
    TotalAmount: number;
    Installments: number;
    PaidAmount: number;
    RemainingAmount: number;
    DueDate: Date;
    Status: string;
    CreatedAt: Date;
}

export interface DebtInstallment {
    Id: string;
    DebtId: string;
    InstallmentNumber: number;
    DueDate: Date;
    Amount: number;
    PaidAmount: number;
    Status: string;
}

export interface User {
    Id: string;
    Name: string;
    Email: string;
    PasswordHash: string;
    FirebaseUid: null;
    CreatedAt: Date;
    UpdatedAt: Date;
    EmailLower: string;
    AuthProvider: string;
}

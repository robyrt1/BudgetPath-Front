export interface ResponseDebts {
    PageNumber: number;
    PageSize: number;
    FirstPage: null;
    LastPage: null;
    TotalPages: number;
    TotalRecords: number;
    NextPage: null;
    previousPage: null;
    Data: Debt[];
    Succeeded: boolean;
    Errors: null;
    Message: null;
}

export interface DebtInstallment {
    Id: string;
    DebtId: string;
    InstallmentNumber: number;
    DueDate: string; // Formato ISO 8601 (e.g., "YYYY-MM-DDTHH:mm:ss")
    Amount: number;
    PaidAmount: number;
    Status: 'Pago' | 'Pendente' | string; // Use um literal se as opções forem fixas
}

/**
 * Representa uma Conta bancária ou de pagamento.
 */
export interface Account {
    Id: string;
    UserId: string;
    Name: string;
    Balance: number;
    CreateAt: string; // Formato ISO 8601 (e.g., "YYYY-MM-DDTHH:mm:ss.ms")
}

/**
 * Representa a Categoria à qual a dívida pertence.
 */
export interface Category {
    Id: string;
    Descript: string;
    GroupId: string;
    UserId: string | null;
    ParentId: string | null;
}

/**
 * Representa a Dívida principal, agregando as parcelas e informações gerais.
 */
export interface Debt {
    Id: string;
    UserId: string;
    AccountId: string;
    CreditCardId: string | null;
    CategoryId: string;
    Description: string;
    TotalAmount: number;
    Installments: number;
    PaidAmount: number;
    RemainingAmount: number;
    DueDate: string; // Data de vencimento da dívida ou da primeira parcela
    Status: 'Pago' | 'Pendente' | string; // Status geral da dívida
    CreatedAt: string; // Data de criação da dívida

    // Propriedades aninhadas
    DebtInstallments: DebtInstallment[];
    Account: Account;
    CreditCard: any | null; // Tipagem 'any' ou uma interface para CreditCard, se existir
    Category: Category;
}

/**
 * Interface para a Estrutura de Resposta (um array de Dívidas).
 */
export type DebtResponse = Debt[];
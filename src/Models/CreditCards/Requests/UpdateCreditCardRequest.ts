export interface UpdateCreditCardRequest {
    id: string;
    name?: string;
    accountId?: string;
    limit?: number;
    maturity?: number;
    closing?: number;
    availableBalance?: number;
    invoiceAmount?: number;
}

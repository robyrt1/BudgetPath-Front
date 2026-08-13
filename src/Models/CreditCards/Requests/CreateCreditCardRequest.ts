export interface CreateCreditCardRequest {
    name: string;
    accountId: string;
    limit?: number;
    maturity: number;
    closing: number;
}

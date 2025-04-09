export interface GetAccountUserResponse {
    Id: string,
    UserId: string,
    Name: string,
    Balance: number,
    CreateAt: string
    CreditCard: CreditCard[]
}

export interface CreditCard {
    Id: string,
    Name: string,
    Limit: number,
    Maturity: number,
    Closing: number,
    AvailableBalance: number,
    InvoiceAmount: number,
    AccountId: string
}
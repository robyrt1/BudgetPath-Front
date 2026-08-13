export interface IUseCreditCardsViewModel {
    error: any;
    createCard(name: string, accountId: string, limit: number, maturity: number, closing: number): Promise<unknown>;
    updateCard(id: string, name?: string, accountId?: string, limit?: number, maturity?: number, closing?: number, availableBalance?: number, invoiceAmount?: number): Promise<unknown>;
    deleteCard(id: string): Promise<unknown>;
}

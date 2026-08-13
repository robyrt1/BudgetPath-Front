import creditCardsModel from "@/Models/CreditCards/CreditCardsModel";
import { useState } from "react";
import { IUseCreditCardsViewModel } from "./Types/CreditCardsViewModel.type";

const CreditCardsViewModel = (): IUseCreditCardsViewModel => {
    const [error, setError] = useState(null);

    return {
        error,
        createCard: async (name: string, accountId: string, limit: number, maturity: number, closing: number) => {
            try {
                const res = await creditCardsModel.create({
                    name,
                    accountId,
                    limit,
                    maturity,
                    closing
                });
                return res;
            } catch (err: any) {
                setError(err);
                throw err;
            }
        },
        updateCard: async (id: string, name?: string, accountId?: string, limit?: number, maturity?: number, closing?: number, availableBalance?: number, invoiceAmount?: number) => {
            try {
                const res = await creditCardsModel.update({
                    id,
                    name,
                    accountId,
                    limit,
                    maturity,
                    closing,
                    availableBalance,
                    invoiceAmount
                });
                return res;
            } catch (err: any) {
                setError(err);
                throw err;
            }
        },
        deleteCard: async (id: string) => {
            try {
                const res = await creditCardsModel.delete({ id });
                return res;
            } catch (err: any) {
                setError(err);
                throw err;
            }
        }
    }
}

export default CreditCardsViewModel;

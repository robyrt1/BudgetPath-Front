'use client';

import TransactionsModel from "@/Models/Transactions/TransactionsModel";
import { get, stubTrue } from "lodash";
import { useState } from "react";
import { IFindTransactions, IFindTrasactionsProps } from "./Types/FindTransactionsType";

const UseFindTransactionViewModel = (props: IFindTrasactionsProps): IFindTransactions => {
    const [error, SetError] = useState(null);

    return {
        error,
        find: async (input: { top?: number, group?: string, year?: string | number, month?: string | number }) => {
            const response = await TransactionsModel.FindTransactions({
                userId: props.UserId,
                top: input.top,
                group: input.group,
                year: input.year,
                month: input.month,
            });
            if (!get(response, 'Succeeded', stubTrue())) {
                const message = get(response, 'details', null);
                SetError(message);
            }
            return response;
        }
    };
};

export default UseFindTransactionViewModel;
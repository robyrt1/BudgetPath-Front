'use client';

import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import TransactionsModel from "@/Models/Transactions/TransactionsModel";
import { ColDef } from "ag-grid-community";
import { get, stubTrue } from "lodash";
import { useState } from "react";
import { IFindTransactions, IFindTrasactionsProps } from "./Types/FindTransactionsType";
import { TransactionsColunsDefs } from "./agGrid/colunDefs";

const UseFindTransactionViewModel = (props: IFindTrasactionsProps): IFindTransactions => {
    const [error, SetError] = useState(null);
    const [colDefs, setColDefs] = useState<ColDef<Datum>[]>(TransactionsColunsDefs);


    return {
        error,
        colDefs,
        find: async () => {

            const response = await TransactionsModel.FindTransactions({ userId: props.UserId });
            if (!get(response, 'Succeeded', stubTrue())) {
                const message = get(response, 'details', null)
                SetError(message);
            }
            return response;
        }
    }
}

export default UseFindTransactionViewModel
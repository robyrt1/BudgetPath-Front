import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { ColDef, ValueGetterParams } from "ag-grid-community";

export const TransactionsColunsDefs: ColDef<Datum>[] = [
    {
        headerName: "Description",
        field: "Description",
        sortable: true,
        filter: true
    },
    {
        headerName: "Category",
        field: "Category.Descript",
        sortable: true,
        filter: true
    },
    {
        headerName: "Group",
        field: "Category.Group.Descript",
        sortable: true,
        filter: true
    },
    {
        headerName: "Accont ",
        field: "Account.Name",
        sortable: true,
        filter: true,
        valueGetter: (params: ValueGetterParams) => {
            return params.data.Account?.Name || params.data.CreditCard?.Name || '';
        }
    },
    {
        headerName: "Transaction Date",
        field: "TransactionDate",
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => new Date(params.value).toLocaleDateString()
    },
    {
        headerName: "Status",
        field: "Status",
        sortable: true,
        filter: true
    },
    {
        headerName: "Value",
        field: "Amount",
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
            const isDespesa = params.data.Category.Group.Descript == 'DESPESA' ? '-' : '+'
            return ` ${isDespesa} R$ ${params.value}`
        },
        cellStyle: (params: any) => {
            const isDespesa = params.data.Category.Group.Descript === 'DESPESA';
            return {
                color: isDespesa ? 'red' : 'green',
                fontWeight: 'bold',
            };
        }
    }
]
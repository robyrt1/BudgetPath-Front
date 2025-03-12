import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { ColDef, ValueGetterParams } from "ag-grid-community";

export const TransactionsColunsDefs: ColDef<Datum>[] = [
    {
        headerName: "Category",
        field: "Category.Descript",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
    },
    {
        headerName: "Account ",
        field: "Account.Name",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        valueGetter: (params: ValueGetterParams) => {
            return params.data?.Account?.Name || params.data?.CreditCard?.Name || '';
        },
        pivot: true,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Value",
        field: "Amount",
        sortable: true,
        // filter: true,
        filter: "agNumberColumnFilter",
        aggFunc: "avg",
        valueFormatter: (params: any) => {
            const isDespesa = (params.data?.Category?.Group?.Descript === 'DESPESA') ? '-' : '+';
            return ` ${isDespesa} R$ ${params.value}`;
        },
        cellStyle: (params: any) => {
            const isDespesa = params.data?.Category?.Group?.Descript === 'DESPESA';
            return {
                color: isDespesa ? 'red' : 'green',
                fontWeight: 'bold',
                textAlign: "center",
            };
        },
    },
    {
        headerName: "Description",
        field: "Description",
        sortable: true,
        filter: true,
        cellRenderer: 'agGroupCellRenderer'
    },
    {
        headerName: "Payment Method",
        field: "PaymentMethod.Description",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Transaction Date",
        field: "TransactionDate",
        sortable: true,
        filter: true,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => new Date(params.value).toLocaleDateString()
    },
    {
        headerName: "Group",
        field: "Category.Group.Descript",
        sortable: true,
        filter: true,
        pivot: true,
        cellStyle: { textAlign: "center" },
        rowGroup: true, hide: true
    },
    {
        headerName: "Status",
        field: "Status",
        sortable: true,
        filter: true,
        cellStyle: { textAlign: "center" },
    }
]
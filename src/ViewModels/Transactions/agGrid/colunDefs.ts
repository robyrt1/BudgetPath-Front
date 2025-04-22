import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { formatNumber } from "@/shared/formatNumber";
import { ColDef, ValueGetterParams } from "ag-grid-community";
import { format, isValid, parseISO } from "date-fns";

export const TransactionsColunsDefs: ColDef<Datum>[] = [
    {
        headerName: "Category",
        field: "Category.Descript",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        chartDataType: 'category',
        enableRowGroup: true,
    },
    {
        headerName: "Account ",
        field: "Account.Name",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        valueGetter: (params: ValueGetterParams) => {
            if (params.data?.CreditCardId) {
                return params.data?.CreditCard?.Name
            }
            return params.data?.Account?.Name || '';
        },
        pivot: true,
        cellStyle: { textAlign: "center" },
        enableRowGroup: true,
    },
    {
        headerName: "Value",
        field: "Amount",
        sortable: true,
        filter: "agNumberColumnFilter",
        valueFormatter: (params: any) => {
            return `${params.value ? 'R$ ' + formatNumber(params.value) : ''}`;
        },
        cellStyle: (params: any) => {
            const isDespesa = params.data?.Category?.Group?.Descript === 'DESPESA';
            const isNegative = params.value < 0;
            return {
                color: isDespesa ? 'red' : 'green',
                fontWeight: 'bold',
                textAlign: "center",
            };
        },
        enableValue: true
    },
    {
        headerName: "Description",
        field: "Description",
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: 'agGroupCellRenderer'
    },
    {
        headerName: "Payment Method",
        field: "PaymentMethod.Description",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        pivot: true,
        cellStyle: { textAlign: "center" },
        chartDataType: 'category',
        enableRowGroup: true,
    },
    {
        headerName: "Transaction Date",
        field: "TransactionDate",
        sortable: true,
        filter: "agDateColumnFilter",
        filterParams: {
            browserDatePicker: true,
            inRangeFloatingFilterDateFormat: "dd/MM/yyyy",
        },
        cellStyle: { textAlign: "center" },
        valueGetter: (params) => {
            const raw: any = params.data?.TransactionDate;
            const parsedDate = parseISO(raw);
            return isValid(parsedDate) ? parsedDate : null;
        },
        valueFormatter: (params) => {
            if (!params.value) return '';
            return format(params.value, 'dd/MM/yyyy'); // <- agora sem parseISO
        },

    },
    {
        headerName: "Group",
        field: "Category.Group.Descript",
        sortable: true,
        filter: true,
        pivot: true,
        cellStyle: { textAlign: "center" },
        enableRowGroup: true,
    },
    {
        headerName: "Status",
        field: "Status",
        sortable: true,
        filter: true,
        cellStyle: { textAlign: "center" },
    }
]
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
        headerName: "Amount",
        field: "Amount",
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: "agAnimateShowChangeCellRenderer",

        valueFormatter: (params: any) => {
            return `${params.value ? 'R$ ' + formatNumber(params.value) : ''}`;
        },
        cellStyle: (params: any) => {
            const colorValue: { [key: string]: string } = {
                DESPESA: 'red',
                RECEITA: 'green',
                '': '',
            };

            const group: string | undefined | null = params.data?.Category?.Group?.Descript;

            const validGroup = group || '';
            return {
                color: colorValue[validGroup],
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
        // filterParams: {
        //     browserDatePicker: true,
        //     inRangeFloatingFilterDateFormat: "dd/MM/yyyy",
        // },
        filterParams: {
            comparator: (filterLocalDateAtMidnight: any, cellValue: any) => {
                const date1 = new Date(cellValue);
                const date2 = new Date(filterLocalDateAtMidnight);
                console.log('date1 >>>', date1, '\ndate2 >>', date2)
                date1.setHours(0, 0, 0, 0);
                date2.setHours(0, 0, 0, 0);

                if (date1 <= date2) return -1;
                if (date1 >= date2) return 1;
                return 0;
            }
        },
        cellStyle: { textAlign: "center" },
        valueGetter: (params) => {
            const raw: any = params.data?.TransactionDate;
            if (params.data?.TransactionDate) {
                const parsedDate = parseISO(raw);
                return isValid(parsedDate) ? parsedDate : null;
            }
            return null
        },
        valueFormatter: (params) => {
            if (!params.value) return '';
            return format(params.value, 'dd/MM/yyyy');
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
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { formatNumber } from "@/shared/formatNumber";
import { ColDef, ValueGetterParams } from "ag-grid-community";
import { format, isValid, parseISO } from "date-fns";
import React from "react";

export const TransactionsColunsDefs: ColDef<Datum>[] = [
    {
        headerName: "Category",
        field: "Category.Descript",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        chartDataType: 'category',
        enableRowGroup: true,
        cellClass: 'text-slate-400 font-medium',
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
        cellClass: 'text-slate-400 font-medium',
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
                DESPESA: '#F87171', // Coral pastal color
                RECEITA: '#34D399', // Emerald pastel color
                '': '',
            };

            const group: string | undefined | null = params.data?.Category?.Group?.Descript;
            return {
                color: colorValue[group || ''],
                fontWeight: '600',
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
        cellRenderer: 'agGroupCellRenderer',
        cellClass: 'text-slate-100 font-medium tracking-wide',
    },
    {
        headerName: "Payment Method",
        field: "PaymentMethod.Description",
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        pivot: true,
        cellStyle: { textAlign: "center" },
        cellClass: 'text-slate-400 font-medium',
        chartDataType: 'category',
        enableRowGroup: true,
    },
    {
        headerName: "Transaction Date",
        field: "TransactionDate",
        sortable: true,
        filter: "agDateColumnFilter",
        filterParams: {
            comparator: (filterLocalDateAtMidnight: any, cellValue: any) => {
                const date1 = new Date(cellValue);
                const date2 = new Date(filterLocalDateAtMidnight);
                date1.setHours(0, 0, 0, 0);
                date2.setHours(0, 0, 0, 0);

                if (date1 <= date2) return -1;
                if (date1 >= date2) return 1;
                return 0;
            }
        },
        cellStyle: { textAlign: "center" },
        cellClass: 'text-slate-400 font-medium',
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
        cellRenderer: (params: any) => {
            const group = params.value;
            if (!group) return '';
            
            const className = group === 'RECEITA' 
                ? 'px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider shadow-sm' 
                : 'px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider shadow-sm';
            
            return React.createElement('div', 
                { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' } }, 
                React.createElement('span', { className }, group)
            );
        }
    },
    {
        headerName: "Status",
        field: "Status",
        sortable: true,
        filter: true,
        cellStyle: { textAlign: "center" },
        cellRenderer: (params: any) => {
            const status = params.value;
            if (!status) return '';
            
            const className = status === 'EFETIVADA' || status === 'PAGO' 
                ? 'px-2.5 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-[10px] font-bold uppercase tracking-wider shadow-sm' 
                : 'px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-300 text-[10px] font-bold uppercase tracking-wider shadow-sm';
            
            return React.createElement('div', 
                { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' } }, 
                React.createElement('span', { className }, status)
            );
        }
    }
];
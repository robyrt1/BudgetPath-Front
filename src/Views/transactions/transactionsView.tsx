import { Datum, ResponseTransactions } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { AgChartsEnterpriseModule, AgChartThemeOverrides } from "ag-charts-enterprise";
import {
    AllCommunityModule,
    ColDef,
    GridReadyEvent,
    ModuleRegistry,
    SideBarDef
} from "ag-grid-community";

import { chartThemeOverridesAgGrid, createHandsetSalesChart, createQuarterlyCategoryChart, createSalesByRefChart } from "@/ViewModels/Transactions/agGrid/CategoryChart";
import AddTransactionPanel from "@/Views/transactions/Panel/AddTransactionPanel";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import {
    AllEnterpriseModule,
    IntegratedChartsModule,
    LicenseManager
} from "ag-grid-enterprise";
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./transactionsView.css";

LicenseManager.setLicenseKey(process.env.LINCENSE as string)
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule, IntegratedChartsModule.with(AgChartsEnterpriseModule),
]);


const TransactionsView = () => {
    const [transactions, setTransactions] = useState<Datum[]>([]);
    const gridRef = useRef<AgGridReact>(null);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: true,
            filter: "agMultiColumnFilter",
            floatingFilter: true,
            sortable: true,
            resizable: true,
        };
    }, []);

    const addTransaction = (newTransaction: Datum) => {
        setTransactions((prev) => [...prev, newTransaction]);
    };

    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { colDefs, error, find } = UseFindTransactionViewModel({ UserId: userId });

    useEffect(() => {
        const fetchTransactions = async () => {
            if (userId) {
                const response: ResponseTransactions = await find();
                setTransactions(response.Data || []);
            }
        };
        fetchTransactions();
    }, [userId]);


    const sideBar = useMemo<SideBarDef | string | string[] | boolean | null>(() => {
        return {
            toolPanels: [
                "columns",
                "filters",
                {
                    id: "addTransaction",
                    labelDefault: "Adicionar Transação",
                    labelKey: "addTransaction",
                    iconKey: "menu",
                    toolPanel: () => <AddTransactionPanel addTransaction={addTransaction} />
                }
            ],
            defaultToolPanel: "columns",
        };
    }, []);

    const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => chartThemeOverridesAgGrid, []);
    const onGridReady = useCallback((params: GridReadyEvent) => params.api.refreshCells(), [])
    const onFirstDataRendered = useCallback((params: any) => {
        createQuarterlyCategoryChart(params.api);
        createSalesByRefChart(params.api);
        createHandsetSalesChart(params.api);

        params.api.createRangeChart({
            cellRange: {
                rowStartIndex: 0,
                rowEndIndex: 8,
                columns: ["Category", "Account", "Value"],
            },
            chartType: "groupedColumn",
            chartThemeOverrides: {
                common: {
                    title: {
                        enabled: true,
                        text: "Average Price by Make",
                    },
                },
            },
        });
    }, [transactions]);

    const autoGroupColumnDef = useMemo<ColDef>(() => {
        return {
            minWidth: 200,
        };
    }, [])
    return (
        <div className="transactions-container">
            <div id="wrapper">
                <div id="top">
                    <div id="lineChart"></div>
                    <div id="donutChart"></div>
                </div>
                <div id="areaChart"></div>
                <div className="transactions-grid">
                    <AgGridReact
                        ref={gridRef}
                        enableCharts={true}
                        cellSelection={true}
                        pivotMode={false}
                        columnDefs={colDefs}
                        rowData={transactions}
                        domLayout="autoHeight"
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        groupDisplayType={"singleColumn"}
                        suppressHorizontalScroll={true}
                        pagination={true}
                        paginationPageSize={10}
                        sideBar={sideBar}
                        chartThemeOverrides={chartThemeOverrides}
                        onFirstDataRendered={onFirstDataRendered}
                        autoGroupColumnDef={autoGroupColumnDef}
                        groupDefaultExpanded={1}
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionsView;

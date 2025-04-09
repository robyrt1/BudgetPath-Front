import { Datum, ResponseTransactions } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { AgChartsEnterpriseModule, AgChartThemeOverrides } from "ag-charts-enterprise";
import {
    AllCommunityModule,
    ClientSideRowModelModule,
    ColDef,
    DateEditorModule,
    FirstDataRenderedEvent,
    GridReadyEvent,
    ModuleRegistry,
    NumberEditorModule,
    NumberFilterModule,
    RowGroupOpenedEvent,
    ScrollApiModule,
    SideBarDef,
    TextEditorModule,
    TextFilterModule,
    ToolPanelSizeChangedEvent,
    ValidationModule
} from "ag-grid-community";

import { Category } from "@/Models/Categories/Responses/FindCategoriesResponse";
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import TransactionsModel from "@/Models/Transactions/TransactionsModel";
import { chartThemeOverridesAgGrid } from "@/ViewModels/Transactions/agGrid/CategoryChart";
import AddTransactionPanel from "@/Views/transactions/Panel/AddTransactionPanel";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import {
    AllEnterpriseModule,
    ColumnMenuModule,
    ColumnsToolPanelModule,
    ContextMenuModule,
    FiltersToolPanelModule,
    IntegratedChartsModule,
    LicenseManager,
    MultiFilterModule,
    RowGroupingModule,
    SetFilterModule,
} from "ag-grid-enterprise";
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import TransactionGrid from "./Grid/TransactionGrid";
import "./transactionsView.css";

LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_LINCENSE as string)
ModuleRegistry.registerModules([
    AllCommunityModule, AllEnterpriseModule, IntegratedChartsModule.with(AgChartsEnterpriseModule,),
    ClientSideRowModelModule,
    IntegratedChartsModule.with(AgChartsEnterpriseModule),
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    ColumnMenuModule,
    ContextMenuModule,
    MultiFilterModule,
    SetFilterModule,
    RowGroupingModule,
    NumberFilterModule,
    TextFilterModule,
    TextEditorModule,
    DateEditorModule,
    NumberEditorModule,
    ValidationModule,
    ScrollApiModule
]);


const TransactionsView = () => {
    const [transactions, setTransactions] = useState<Datum[]>([]);
    const gridRef = useRef<AgGridReact>(null);
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { colDefs, error, find } = UseFindTransactionViewModel({ UserId: userId });
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            editable: true,
            filter: "agMultiColumnFilter",
            floatingFilter: true,
            sortable: true,
            resizable: true,
        };
    }, []);

    const addTransaction = async (newTransaction: RequestCreateTransaction) => {
        try {
            const result = await TransactionsModel.CreateTransaction(newTransaction);
            await fetchTransactions()
            return result;
        } catch (error) {
            throw error;
        }
    };

    const fetchTransactions = async () => {
        if (userId) {
            const response: ResponseTransactions = await find({});
            setTransactions(response.Data || []);
        }
    };
    useEffect(() => {
        fetchTransactions();
    }, [userId]);


    const panelRef = useRef<HTMLDivElement>(null);

    const handleToolPanelSizeChanged = (event: ToolPanelSizeChangedEvent) => {
        if (panelRef.current) {
            panelRef.current.style.width = `${event.width}px`;
            panelRef.current.style.transition = "width 0.3s ease-in-out";
        }
    };

    const sideBar = useMemo<SideBarDef | string | string[] | boolean | null>(() => {
        return {
            toolPanels: [
                "columns",
                "filters",
                {
                    id: "addTransaction",
                    labelDefault: "Add Transaction",
                    labelKey: "addTransaction",
                    iconKey: "menu",
                    toolPanel: () => <div
                    >
                        <AddTransactionPanel
                            addTransaction={addTransaction}
                            ref={panelRef}
                        />
                    </div>
                }
            ],
            // defaultToolPanel: "columns",
        };
    }, []);

    const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => chartThemeOverridesAgGrid, []);
    const onGridReady = useCallback((params: GridReadyEvent) => {
        // params.api.setGridOption("rowData", transactions);
        params.api.refreshCells()
    }, [])
    const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
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

    const onRowGroupOpened = useCallback(
        (event: RowGroupOpenedEvent<Category[]>) => {
            if (event.expanded) {
                const rowNodeIndex = event.node.rowIndex!;
                const childCount = event.node.childrenAfterSort
                    ? event.node.childrenAfterSort.length
                    : 0;
                const newIndex = rowNodeIndex + childCount;
                gridRef.current!.api.ensureIndexVisible(newIndex);
            }
        },
        [],
    );


    const handleGridReady = useCallback((params: any) => {
        window.gridApi = params.api;
        window.columnApi = params.columnApi;
    }, []);

    const handleExport = () => {
        window.gridApi?.exportDataAsExcel({
            fileName: "transacoes.xlsx",
            sheetName: "Transações"
        });
    };

    const handleGroupByCategory = () => {
        window.columnApi?.setRowGroupColumns(["Category"]);
    };

    const handleClearGrouping = () => {
        window.columnApi?.setRowGroupColumns([]);
    };

    return (
        <div className="transactions-container">
            <TransactionGrid
                colDefs={colDefs}
                transactions={transactions}
                addTransaction={addTransaction}
                onGridReady={handleGridReady}
                onGroupBy={handleGroupByCategory}
            />
        </div>
    );
};

export default TransactionsView;

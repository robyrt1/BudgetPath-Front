// components/TransactionGrid.tsx
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import AddTransactionPanel from "@/Views/transactions/Panel/AddTransactionPanel";
import { AgChartThemeOverrides } from "ag-charts-enterprise";
import {
    ColDef,
    FirstDataRenderedEvent,
    GridReadyEvent,
    RowGroupOpenedEvent,
    SideBarDef,
    ToolPanelSizeChangedEvent
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useMemo, useRef } from "react";
import "../transactionsView.css";


interface Props {
    colDefs: ColDef[];
    transactions: Datum[];
    addTransaction: (data: RequestCreateTransaction) => Promise<any>;
    onGridReady: (params: GridReadyEvent) => void;
    onGroupBy: (column: string) => void;
}

const TransactionGrid: React.FC<Props> = ({ colDefs, transactions, addTransaction, onGridReady }) => {
    const gridRef = useRef<AgGridReact>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const defaultColDef = useMemo<ColDef>(() => ({
        editable: true,
        filter: "agMultiColumnFilter",
        floatingFilter: true,
        sortable: true,
        resizable: true,
    }), []);

    const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => ({
        common: {
            title: { enabled: true, text: "Average Price by Make" },
        },
    }), []);


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

    const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
        params.api.createRangeChart({
            cellRange: {
                rowStartIndex: 0,
                rowEndIndex: 8,
                columns: ["Category", "Account", "Value"],
            },
            chartType: "groupedColumn",
            chartThemeOverrides
        });
    }, []);

    const onRowGroupOpened = useCallback(
        (event: RowGroupOpenedEvent) => {
            if (event.expanded && event.node.rowIndex !== null) {
                const newIndex = event.node.rowIndex + (event.node.childrenAfterSort?.length || 0);
                gridRef.current?.api.ensureIndexVisible(newIndex);
            }
        },
        [],
    );



    return (
        <div className="transactions-grid">
            <AgGridReact
                ref={gridRef}
                enableCharts={true}
                cellSelection={true}
                pivotMode={false}
                columnDefs={colDefs}
                rowData={transactions}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                groupDisplayType={"singleColumn"}
                suppressHorizontalScroll={false}
                suppressExcelExport={false}
                pagination={false}
                rowBuffer={10}
                animateRows={false}
                onRowGroupOpened={onRowGroupOpened}
                sideBar={sideBar}
                onToolPanelSizeChanged={handleToolPanelSizeChanged}
                chartThemeOverrides={chartThemeOverrides}
                onFirstDataRendered={onFirstDataRendered}
                // autoGroupColumnDef={autoGroupColumnDef}
                groupDefaultExpanded={1}
            />
        </div>
    );
};

export default TransactionGrid;

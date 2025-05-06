// components/TransactionGrid.tsx
import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { getContextMenuItems } from "@/ViewModels/Transactions/agGrid/ContextMenuItems";
import { AgChartThemeOverrides } from "ag-charts-enterprise";
import {
    ColDef,
    colorSchemeDarkBlue,
    FirstDataRenderedEvent,
    GridReadyEvent,
    IServerSideDatasource,
    RowGroupOpenedEvent,
    themeQuartz,
    ToolPanelSizeChangedEvent
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "../transactionsView.css";
import { SideBarGrid } from "./SiderBarGrid";


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
    const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);
    const [gridApi, setGridApi] = useState<any>(null);


    // const onGridReady = (params: any) => {
    //     setGridApi(params.api);
    // };

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

    const datasource: IServerSideDatasource<any> = {
        getRows: (params) => {
            console.log('🚀 filterModel:', params.request.filterModel);
        },
    };

    const getSelectedDateRange = () => {
        const filterModel = gridApi?.getFilterModel();
        if (filterModel && filterModel.TransactionDate) {
            const { dateFrom, dateTo } = filterModel.TransactionDate;
            return {
                startDate: dateFrom,
                endDate: dateTo,
            };
        }
        return null;
    };

    const fetchFilteredData = () => {
        const dateRange = getSelectedDateRange();
        console.log(dateRange)
        if (dateRange) {
            console.log('Chamando API com intervalo de datas:', dateRange);
        }
    };

    return (
        <div className="transactions-grid ag-theme-balham-dark w-full h-full">
            {/* <button onClick={fetchFilteredData}>Buscar dados filtrados</button> */}
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
                sideBar={SideBarGrid(addTransaction, panelRef)}
                onToolPanelSizeChanged={handleToolPanelSizeChanged}
                chartThemeOverrides={chartThemeOverrides}
                onFirstDataRendered={onFirstDataRendered}
                theme={themeDarkBlue}
                serverSideDatasource={datasource}
                groupDefaultExpanded={1}
                getContextMenuItems={getContextMenuItems}
            />
        </div>
    );
};

export default TransactionGrid;

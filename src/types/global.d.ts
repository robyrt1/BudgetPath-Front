import type { ColumnApi, GridApi } from "ag-grid-community";

declare global {
    interface Window {
        gridApi?: GridApi;
        columnApi?: ColumnApi;
    }
}
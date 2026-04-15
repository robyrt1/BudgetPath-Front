import type { ColumnApi, GridApi } from "ag-grid-community";

declare global {
    interface Window {
        gridApi?: GridApi;
        columnApi?: ColumnApi;
    }
}

// Allow importing any CSS file as a side-effect (e.g. ag-grid themes, skeleton)
declare module '*.css';
declare module 'ag-grid-community/styles/*.css';
declare module 'react-loading-skeleton/dist/skeleton.css';
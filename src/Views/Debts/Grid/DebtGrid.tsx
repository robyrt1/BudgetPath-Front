import { ColDef, colorSchemeDarkBlue, GridReadyEvent, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState } from "react";

export interface DebtGridProps {
    colDefs: ColDef[];
    debts: any[];
    addDebt: (data: any) => Promise<any>;
    onGridReady?: (params: GridReadyEvent) => void;
    onGroupBy?: (column: string) => void;
}

const DebtsGrid: React.FC<DebtGridProps> = ({ colDefs, debts, addDebt, onGridReady }) => {
    const gridRef = useRef<AgGridReact>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);
    const [gridApi, setGridApi] = useState<any>(null);


    const defaultColDef = useMemo<ColDef>(() => ({
        editable: true,
        filter: "agMultiColumnFilter",
        floatingFilter: true,
        sortable: true,
    }), []);

    return (
        <div className="ag-theme-balham-dark h-[calc(100vh-9rem)] w-[calc(185vh-1rem)] mt-2" >
            <AgGridReact
                ref={gridRef}
                onGridReady={onGridReady}
                columnDefs={colDefs}
                rowData={debts}
                defaultColDef={defaultColDef}
                masterDetail={true}
            />
        </div>
    );
};

export default DebtsGrid;

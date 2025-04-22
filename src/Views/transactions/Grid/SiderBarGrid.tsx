import AddTransactionPanel from "@/Views/transactions/Panel/AddTransactionPanel";
import { SideBarDef } from "ag-grid-community";
import { useMemo } from "react";

export const SideBarGrid = (addTransaction: any, panelRef: any) => useMemo<SideBarDef | string | string[] | boolean | null>(() => {
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
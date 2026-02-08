import { Datum, ResponseTransactions } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
    AllCommunityModule,
    ClientSideRowModelModule,
    DateEditorModule,
    ModuleRegistry,
    NumberEditorModule,
    NumberFilterModule,
    ScrollApiModule,
    TextEditorModule,
    TextFilterModule,
    ValidationModule
} from "ag-grid-community";

import { RequestCreateTransaction } from "@/Models/Transactions/Requests/RequesTransactions";
import TransactionsModel from "@/Models/Transactions/TransactionsModel";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import {
    AllEnterpriseModule,
    CellSelectionModule,
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
import { useCallback, useEffect, useState } from "react";
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
    ScrollApiModule,
    CellSelectionModule
]);


const TransactionsView = () => {
    const [transactions, setTransactions] = useState<Datum[]>([]);
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { colDefs, error, find } = UseFindTransactionViewModel({ UserId: userId });

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

    useEffect(() => {
        fetchTransactions();
    }, [userId]);


    return (
        <div className="transactions-container flex flex-col mt-10">
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

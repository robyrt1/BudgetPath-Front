import { Datum, ResponseTransactions } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import {
    AllCommunityModule, ColDef, ModuleRegistry,
    themeBalham
} from "ag-grid-community";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css'; // Importe apenas o tema que você deseja usar
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./transactionsView.css";

ModuleRegistry.registerModules([AllCommunityModule]);



const TransactionsView = () => {
    const [transactions, setTransactions] = useState<Datum[]>([]);
    const [mounted, setMounted] = useState(false);

    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { colDefs, error, find } = UseFindTransactionViewModel({ UserId: userId });
    const defaultColDef: ColDef = {
        flex: 1,
    };



    useEffect(() => {
        const fetchTransactions = async () => {
            if (userId) {
                const response: ResponseTransactions = await find();
                setTransactions(response.Data || []);
            }
        };
        fetchTransactions();
    }, [userId]);


    return (
        <div className="transactions-container">
            <div className="transactions-grid">
                <AgGridReact
                    theme={themeBalham}
                    columnDefs={colDefs}
                    rowData={transactions}
                    domLayout="autoHeight"
                    defaultColDef={defaultColDef}
                    onGridReady={(params) => {
                        params.api.refreshCells();
                    }}
                    suppressHorizontalScroll={true}  // Evita a barra de rolagem horizontal
                    pagination={true}  // Habilita paginação se necessário
                    paginationPageSize={10}
                />
            </div>
        </div>
    );
};

export default TransactionsView;

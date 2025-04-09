// components/TransactionToolbar.tsx
import React from 'react';

interface Props {
    loading: boolean;
    error: string | null;
    onExport: () => void;
    onGroupByCategory: () => void;
    onClearGrouping: () => void;
}

const TransactionToolbar: React.FC<Props> = ({ loading, error, onExport, onGroupByCategory, onClearGrouping }) => {
    return (
        <div className="flex gap-4 items-center mb-4">
            <button
                onClick={onExport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Exportar Excel
            </button>
            <button
                onClick={onGroupByCategory}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                Agrupar por Categoria
            </button>
            <button
                onClick={onClearGrouping}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Limpar Agrupamento
            </button>

            {loading && <span className="text-blue-500 ml-4">🔄 Carregando transações...</span>}
            {error && <span className="text-red-500 ml-4">{error}</span>}
        </div>
    );
};

export default TransactionToolbar;

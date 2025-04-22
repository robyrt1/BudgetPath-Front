"use client";
import { useState } from "react";
import Installments from "./Installments"; // Importando o componente de parcelas

const DebtList = () => {
  // Dados de exemplo para a dívida
  const debts = [
    {
      id: "a2048220-780c-4c36-a1ea-7af56367e9fc",
      description: "Plano Odontológico",
      totalAmount: 305.91,
      paidAmount: 118.31,
      remainingAmount: 187.6,
      dueDate: "2025-03-18T00:00:00",
      installments: 3,
      status: "Pendente",
    },
    // Mais dívidas podem ser adicionadas aqui
  ];

  const [selectedDebt, setSelectedDebt] = useState<any>(null);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">Minhas Dívidas</h1>

      {/* Lista de Dívidas */}
      {debts.map((debt) => (
        <div key={debt.id} className="border p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">{debt.description}</h2>
            <p className="text-lg font-semibold text-green-600">R$ {debt.totalAmount.toFixed(2)}</p>
          </div>
          <p className="text-sm text-gray-600">Vencimento: {new Date(debt.dueDate).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">Status: {debt.status}</p>
          <p className="text-sm text-gray-600">Valor Pago: R$ {debt.paidAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Restante: R$ {debt.remainingAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Parcelas: {debt.installments}</p>

          <button
            className="mt-2 text-blue-500 hover:underline"
            onClick={() => setSelectedDebt(debt)} // Selecionando a dívida
          >
            Ver Parcelas
          </button>
        </div>
      ))}

      {/* Condicional para mostrar as parcelas */}
      {selectedDebt && (
        <Installments debt={selectedDebt} onClose={() => setSelectedDebt(null)} />
      )}
    </div>
  );
};

export default DebtList;

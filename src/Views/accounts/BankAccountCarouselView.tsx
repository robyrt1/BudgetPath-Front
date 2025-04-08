// components/BankAccountCarousel.tsx
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function BankAccountCarousel({ showBalances, setShowBalances }: { showBalances?: boolean, setShowBalances: Dispatch<SetStateAction<boolean>> }) {
  const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
  const { accounts, find, error } = AccountViewModel({ UserId: userId });


  const maskedId = (id: string) => {
    const idStr = id.toString();
    return idStr.length > 10 ? `***${idStr.slice(-4)}` : idStr;
  };

  const calcularTotal = (accounts: { Balance: string | number }[]) => {
    return accounts.reduce((total, acc) => {
      const saldo = typeof acc.Balance === 'string' ? parseFloat(acc.Balance.replace(',', '.')) : acc.Balance;
      return total + saldo;
    }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };


  useEffect(() => {
    find();
  }, [userId]);

  return (
    <div className="relative w-full max-w-12xl mx-auto">

      <div className="flex justify-end pr-10 mt-5">
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showBalances ? <FaEyeSlash className="mr-1" /> : <FaEye className="mr-1" />}
          {showBalances ? "Ocultar saldos" : "Mostrar saldos"}
        </button>
      </div>
      {/* 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {accounts.map(account => (
          <div key={account.Id} className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">{account.Name}</p>
            <p className="text-lg font-bold">Débito</p>
            <p className="text-2xl font-semibold text-indigo-600 mt-2">
              {showBalances ? account.Balance : "R$ ****"}
            </p>
            <p className="text-xs text-gray-400 mt-1">ID: {maskedId(account.Id)}</p>
          </div>
        ))}
      </div> */}


      <div className="bg-white rounded-xl shadow p-6 mt-3">
        <h3 className="text-xl font-bold mb-4">Minhas Contas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {accounts.map(account => (
            <div key={account.Id} className="border p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">{account.Name}</div>
              <div className="text-lg font-bold">{showBalances ? `R$ ${account.Balance}` : "R$ ****"}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <span className="text-sm text-gray-500 mr-2">Total:</span>
          <span className="text-xl font-bold text-indigo-600">
            {showBalances ? calcularTotal(accounts) : "R$ ****"}
          </span>
        </div>
      </div>
    </div>
  );
}

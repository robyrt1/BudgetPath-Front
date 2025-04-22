// components/BankAccountCarousel.tsx
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";
import { first } from "lodash";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";
import './BankAccountView.css';
export default function BankAccount({ showBalances, setShowBalances }: { showBalances?: boolean, setShowBalances: Dispatch<SetStateAction<boolean>> }) {
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
      <div
        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
        className="dark-card shadow-sm">
        <h3 className="text-xl font-bold mb-4">My accounts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {accounts ? accounts?.map(account => (
            <div key={account.Id} className="border p-4 rounded-lg shadow-sm">
              <div className="text-xl opacity-80">{account.Name}</div>
              <div className="text-lg font-bold">{showBalances ? `R$ ${account.Balance}` : "R$ ****"}</div>
              {first(account.CreditCard)?.AvailableBalance ?
                (<div>Credit: {showBalances ? `R$ ${first(account.CreditCard)?.AvailableBalance}` : "R$ ****"}</div>)
                : ""
              }
            </div>
          )) : ''}
        </div>
        <div className="mt-4 text-right">
          <span className="text-sm opacity-80 mr-2">Total:</span>
          <span className="text-xl font-bold" style={{ color: "#60a5fa" }}>
            {showBalances ? calcularTotal(accounts) : "R$ ****"}
          </span>
        </div>
      </div>
    </div>
  );
}

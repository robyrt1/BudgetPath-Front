// components/BankAccountCarousel.tsx
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { Icon } from "@iconify/react";
import AccountViewModel from "@/ViewModels/Accounts/AccountViewModel";
import { first } from "lodash";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
    <div className="relative w-full">
      <div className="rounded-2xl border border-white/5 bg-[#111827] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100 tracking-tight">My accounts</h3>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center text-sm bg-white/5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
          >
            {showBalances ? <FaEyeSlash className="mr-1" /> : <FaEye className="mr-1" />}
            {showBalances ? "Hide balance" : "Show balance"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accounts ? accounts?.map(account => (
            <div key={account.Id} className="flex flex-col justify-between gap-4 p-4 rounded-xl border border-white/5 bg-[#1A2235] shadow-inner transition-colors hover:bg-white/5 hover:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
                    <Icon icon="mingcute:bank-line" className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{account.Name}</span>
                </div>
                {first(account.CreditCard) ? (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border border-purple-500/20 bg-purple-500/10 text-purple-400">Credit</span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border border-teal-500/20 bg-teal-500/10 text-teal-400">Debit</span>
                )}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Balance</div>
                  <div className="text-lg font-bold text-slate-100">{showBalances ? `R$ ${account.Balance}` : "R$ ****"}</div>
                </div>
                {first(account.CreditCard)?.AvailableBalance && (
                   <div className="text-right">
                     <div className="text-xs text-slate-500 uppercase tracking-wide">Available</div>
                     <div className="text-sm font-semibold text-slate-200">{showBalances ? `R$ ${first(account.CreditCard)?.AvailableBalance}` : "R$ ****"}</div>
                   </div>
                )}
              </div>
            </div>
          )) : ''}
        </div>
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end items-center">
          <span className="text-sm text-slate-400 mr-3 uppercase tracking-wide">Total Balance:</span>
          <span className="text-2xl font-bold text-[#3B82F6]">
            {showBalances ? calcularTotal(accounts) : "R$ ****"}
          </span>
        </div>
      </div>
    </div>
  );
}

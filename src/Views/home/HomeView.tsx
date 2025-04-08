import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { formatNumber } from "@/shared/formatNumber";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BankAccountCarousel from "../accounts/BankAccountCarouselView";
import DespesasEvolucao from "./Chart/ExpensesEvolution";
import './HomeView.css';

const HomeView = () => {
  const [transactions, setTransactions] = useState<Datum[]>([]);
  const userId = useSelector((state: { auth: AuthState }) => {
    return state.auth.userId
  });
  const { error, find } = UseFindTransactionViewModel({ UserId: userId });
  const [showBalances, setShowBalances] = useState(true);


  useEffect(() => {
    if (!userId) return;
    const fetchTransactions = async () => {
      const defaultTop = 15;
      if (userId != '') {
        try {
          const response = await find(defaultTop);
          setTransactions(response.Data || []);
        } catch (err) {
          console.log(err)
        }
      }
    };
    fetchTransactions();
  }, [userId]);

  return (
    <div className="home-container">
      <section>
        <BankAccountCarousel showBalances={showBalances} setShowBalances={setShowBalances} />
      </section>

      <section>
        <DespesasEvolucao showBalances={showBalances} />
      </section>
      <section className="bg-white shadow-md rounded-xl p-4 w-full max-w-xl mt-2">
        <h2 className="text-lg font-bold mb-2">Últimas Transações</h2>

        <ul className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100 divide-y divide-gray-100">
          {transactions.map((transaction, index) => (
            <li key={transaction.Id || index} className="py-3 flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-700">{transaction.Description}</p>
                <div className="text-sm text-gray-500 space-x-2">
                  <span>Conta: {transaction.Account?.Name || transaction.CreditCard.Name}</span>
                  <span>• Categoria: {transaction.Category?.Descript}</span>
                  <span>• {new Date(transaction.TransactionDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`text-right font-semibold ${transaction.Category.Group.Descript == 'DESPESA' ? 'text-red-500' : 'text-green-600'}`}>
                R$ {formatNumber(String(transaction.Amount))}
              </div>
            </li>
          ))}
        </ul>
      </section>


    </div>
  );
};

export default HomeView;

import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { formatNumber } from "@/shared/formatNumber";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BankAccount from "../accounts/BankAccountView";
import CategoryChart from "./Chart/CategoryChart";
import ExpensesEvolution from "./Chart/ExpensesEvolution";
import './HomeView.css';

const HomeView = () => {
  const [transactions, setTransactions] = useState<Datum[]>([]);
  const userId = useSelector((state: { auth: AuthState }) => {
    return state.auth.userId
  });
  const { find } = UseFindTransactionViewModel({ UserId: userId });
  const [showBalances, setShowBalances] = useState(false);
  const [transactionsForChart, setTransactionsForChart] = useState<Datum[]>([])


  useEffect(() => {
    if (!userId) return;
    const fetchTransactions = async () => {
      const defaultTop = 15;
      if (userId != '') {
        try {
          const [topTenTransaction, transactionsForChartResponse] = await Promise.all([
            find({ top: defaultTop }),
            find({ group: 'DESPESA' })
          ])
          setTransactions(topTenTransaction.Data || []);
          setTransactionsForChart(transactionsForChartResponse.Data)
        } catch (err) {
        }
      }
    };
    fetchTransactions();
  }, [userId]);

  return (
    <div className="home-container">

      {/* <section>
        <div className="flex justify-end pr-10 mt-5 fixed right-20 z-50">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showBalances ? <FaEyeSlash className="mr-1" /> : <FaEye className="mr-1" />}
            {showBalances ? "Hide balance" : "Show balance"}
          </button>
        </div>
      </section> */}

      <section>
        <BankAccount showBalances={showBalances} setShowBalances={setShowBalances} />
      </section>

      <section>
        <ExpensesEvolution showBalances={showBalances} />
      </section>

      <section className="flex mt-3 mb-3 gap-6">
        <section
          className="rounded-xl p-4 w-full flex-[0.6] mt-2 shadow-md"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid #2f365f"
          }}
        >
          <h2 className="text-lg font-bold mb-2">Latest transactions</h2>

          <ul className="divide-y divide-gray-200 max-h-[270px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 scrollbar-track-gray-100">
            {transactions.map((transaction, index) => (
              <li
                key={transaction.Id || index}
                className="py-2 flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">{transaction.Description}</p>
                  <div className="text-sm opacity-80 space-x-2">
                    <span>Account: {transaction.Account?.Name || transaction.CreditCard.Name}</span>
                    <span>• Category: {transaction.Category?.Descript}</span>
                    <span>• {new Date(transaction.TransactionDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div
                  className={`text-right font-semibold ${transaction.Category.Group.Descript === "DESPESA"
                    ? "text-red-400"
                    : "text-green-400"
                    }`}
                >
                  {showBalances ? `R$ ${formatNumber(String(transaction.Amount))}` : "R$ ****"}
                </div>
              </li>
            ))}
          </ul>
        </section>


        <section className="flex-[0.4]">
          <CategoryChart transactions={transactionsForChart} showBalances={showBalances} />
        </section>
      </section>



    </div>
  );
};

export default HomeView;

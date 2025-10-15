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
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)


  useEffect(() => {
    if (!userId) return;
    const fetchTransactions = async () => {
      const defaultTop = 15;
      if (userId != '') {
        try {
          const now = new Date();
          const [topTenTransaction, transactionsForChartResponse] = await Promise.all([
            find({ top: defaultTop }),
            find({ group: 'DESPESA', year, month: month })
          ])
          setTransactions(topTenTransaction.Data || []);
          setTransactionsForChart(transactionsForChartResponse.Data)
        } catch (err) {
        }
      }
    };
    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchTransactions = async () => {
      const defaultTop = 15;
      if (userId != '') {
        try {
          const now = new Date();
          const [topTenTransaction, transactionsForChartResponse] = await Promise.all([
            find({ top: defaultTop }),
            find({ group: 'DESPESA', year, month: month })
          ])
          setTransactions(topTenTransaction.Data || []);
          setTransactionsForChart(transactionsForChartResponse.Data)
        } catch (err) {
        }
      }
    };
    fetchTransactions();
  }, [year, month]);

  return (
    <div className="home-container">
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
                  {transaction.Category.Group.Descript != 'DESPESA' ? (
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#00fc4a" d="M11.78 11.78a.75.75 0 0 0 0-1.06L6.56 5.5h3.69a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0-.75.75v5.5a.75.75 0 0 0 1.5 0V6.56l5.22 5.22a.75.75 0 0 0 1.06 0" />
                      </svg>
                      <p className="font-medium ml-1">{transaction.Description}</p>
                    </div>
                  ) : (
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#fc0000" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0" /></svg>
                      <p className="font-medium ml-1">{transaction.Description}</p>
                    </div>
                  )}
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
          <CategoryChart transactions={transactionsForChart} showBalances={showBalances} setYear={setYear} setMonth={setMonth} year={year} month={month} />
        </section>
      </section>



    </div>
  );
};

export default HomeView;

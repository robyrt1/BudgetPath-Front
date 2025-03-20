import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { formatNumber } from "@/shared/formatNumber";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './HomeView.css';

const HomeView = () => {
  const [transactions, setTransactions] = useState<Datum[]>([]);
  const userId = useSelector((state: { auth: AuthState }) => {
    return state.auth.userId
  });
  const { error, find } = UseFindTransactionViewModel({ UserId: userId });


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
      <div className="grid">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-500">R$ 15.000,00</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-500">R$ 5.200,00</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-500">R$ 3.800,00</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4 w-full mt-6">
        <h2 className="text-lg font-bold mb-2">Fluxo de Caixa</h2>
        <p>📊 Aqui entrará o gráfico das finanças</p>
      </div>

      <div className=" bg-white shadow-md rounded-xl p-4 w-full mt-5">
        <h2 className="text-lg font-bold ">Últimas Transações</h2>
        <ul className=" transaction-container space-y-2">
          {transactions.map((transaction, index) => (
            <li key={transaction.Id || index} className="flex justify-between">
              <div>
                <span>{transaction.Description}</span>
                <div className="text-sm text-gray-500">
                  <span>Conta: {transaction.Account?.Name || transaction.CreditCard.Name}</span>
                  <span className="ml-2">Categoria: {transaction.Category?.Descript}</span>
                  <span className="ml-2">Data: {new Date(transaction.TransactionDate).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={transaction.Amount < 0 ? 'text-red-500' : 'text-green-500'}>
                {'R$'} {formatNumber(String(transaction.Amount))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomeView;

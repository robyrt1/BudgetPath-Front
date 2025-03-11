import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Datum } from "@/Models/Transactions/Responses/ResponseTransacrions";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import UseFindTransactionViewModel from "@/ViewModels/Transactions/TransactionsViewModel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Datum[]>([]);
  const userId = useSelector((state: { auth: AuthState }) => {
    return state.auth.userId
  });
  const { error, find } = UseFindTransactionViewModel({ UserId: userId });


  useEffect(() => {
    if (!userId) return;
    const fetchTransactions = async () => {
      if (userId != '') {
        try {
          const response = await find();
          setTransactions(response.Data || []);
        } catch (err) {
          console.log(err)
        }
      }
    };
    fetchTransactions();
  }, [userId]);

  return (
    <div className="mt-20 min-h-screen w-full p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <div className="bg-white shadow-md rounded-xl p-4 w-full mt-6">
        <h2 className="text-lg font-bold mb-2">Últimas Transações</h2>
        <ul className="space-y-2">
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
              <span className={transaction.Category?.Group?.Descript === 'DESPESA' ? 'text-red-500' : 'text-green-500'}>
                {transaction.Category?.Group?.Descript === 'DESPESA' ? '-' : '+'} {transaction.Amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="mt-20 min-h-screen w-full p-2">
      {/* Resumo Financeiro */}
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

      {/* Gráfico Financeiro */}
      <div className="bg-white shadow-md rounded-xl p-4 w-full mt-6">
        <h2 className="text-lg font-bold mb-2">Fluxo de Caixa</h2>
        <p>📊 Aqui entrará o gráfico das finanças</p>
      </div>

      {/* Transações Recentes */}
      <div className="bg-white shadow-md rounded-xl p-4 w-full mt-6">
        <h2 className="text-lg font-bold mb-2">Últimas Transações</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>💡 Conta de Luz</span>
            <span className="text-red-500">- R$ 150,00</span>
          </li>
          <li className="flex justify-between">
            <span>🍔 Restaurante</span>
            <span className="text-red-500">- R$ 90,00</span>
          </li>
          <li className="flex justify-between">
            <span>💰 Salário</span>
            <span className="text-green-500">+ R$ 3.000,00</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

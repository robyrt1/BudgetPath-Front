import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Button from "@/components/ui/Button";

interface ForecastItem {
    date: string;
    projectedExpense: number;
    projectedIncome: number;
    projectedSavings: number;
}

interface ForecastResponse {
    historicalAverage: {
        expense: number;
        income: number;
    };
    forecast: ForecastItem[];
}

interface Rule503020 {
    needsPercentage: number;
    wantsPercentage: number;
    savingsPercentage: number;
}

interface SummaryData {
    avgMonthlyIncome: number;
    avgMonthlyExpense: number;
    nextMonthProjectedIncome: number;
    nextMonthProjectedExpense: number;
    rule50_30_20: Rule503020;
}

interface BudgetLimit {
    categoryId: string;
    categoryName: string;
    classification: string;
    historicalAverage: number;
    recommendedLimit: number;
}

interface RecommendationAdvice {
    category: string;
    type: string;
    message: string;
}

interface RecommendationsResponse {
    summary: SummaryData;
    budgets: BudgetLimit[];
    recommendations: RecommendationAdvice[];
}

interface StatusResponse {
    status: string;
    isTraining: boolean;
    lastTrainingError: string | null;
    modelsLoaded: {
        nlp: boolean;
        expenseForecaster: boolean;
        incomeForecaster: boolean;
    };
    metrics: any;
}

const AiView = () => {
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [forecast, setForecast] = useState<ForecastResponse | null>(null);
    const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [trainingLoading, setTrainingLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const aiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5005";

    const fetchAllData = async () => {
        try {
            setError(null);
            const [statusRes, forecastRes, recsRes] = await Promise.all([
                fetch(`${aiUrl}/api/status`).then(r => r.ok ? r.json() : null),
                fetch(`${aiUrl}/api/forecast`).then(r => r.ok ? r.json() : null),
                fetch(`${aiUrl}/api/budget/recommendations`).then(r => r.ok ? r.json() : null)
            ]);

            if (statusRes) setStatus(statusRes);
            if (forecastRes) setForecast(forecastRes);
            if (recsRes) setRecommendations(recsRes);
        } catch (err: any) {
            setError("Não foi possível conectar ao serviço de IA. Verifique se o BudgetPath-AI está rodando na porta 5005.");
            console.error("AI service error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleTrainModels = async () => {
        setTrainingLoading(true);
        try {
            const res = await fetch(`${aiUrl}/api/train`, { method: "POST" });
            if (res.ok) {
                // Poll status every 3 seconds until training completes
                const interval = setInterval(async () => {
                    const statusRes = await fetch(`${aiUrl}/api/status`).then(r => r.json());
                    setStatus(statusRes);
                    if (!statusRes.isTraining) {
                        clearInterval(interval);
                        setTrainingLoading(false);
                        fetchAllData();
                    }
                }, 3000);
            } else {
                setTrainingLoading(false);
            }
        } catch (err) {
            console.error("Failed to train models:", err);
            setTrainingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] w-full">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Calculations helper
    const savingsRate = recommendations?.summary
        ? Math.max(0, Math.round(((recommendations.summary.nextMonthProjectedIncome - recommendations.summary.nextMonthProjectedExpense) / (recommendations.summary.nextMonthProjectedIncome || 1)) * 100))
        : 0;

    return (
        <div className="w-full max-w-[1645px] mx-auto px-4 md:px-8 py-6 text-slate-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Inteligência Artificial & Previsões
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Previsões de fluxo de caixa e otimização de orçamentos por inteligência artificial (TensorFlow.js)
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status do Modelo</span>
                        <span className="text-xs font-semibold text-indigo-400">{status?.status || "Modelos carregados"}</span>
                    </div>
                    <Button 
                        onClick={handleTrainModels} 
                        disabled={trainingLoading || status?.isTraining}
                        variant="secondary"
                        size="sm"
                    >
                        {trainingLoading || status?.isTraining ? "Treinando..." : "Treinar IA"}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* Top Metrics */}
            {recommendations?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-5 rounded-xl border border-white/5 bg-[#111827] shadow-lg">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Renda Mensal Prevista</span>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">R$ {recommendations.summary.nextMonthProjectedIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="p-5 rounded-xl border border-white/5 bg-[#111827] shadow-lg">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Despesa Mensal Prevista</span>
                        <div className="text-2xl font-bold text-rose-400 mt-1">R$ {recommendations.summary.nextMonthProjectedExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="p-5 rounded-xl border border-white/5 bg-[#111827] shadow-lg">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Taxa de Poupança Projetada</span>
                        <div className="text-2xl font-bold text-indigo-400 mt-1">{savingsRate}%</div>
                    </div>
                </div>
            )}

            {/* Forecast Chart */}
            {forecast && forecast.forecast && forecast.forecast.length > 0 && (
                <div className="p-6 rounded-xl border border-white/5 bg-[#111827] shadow-lg mb-8">
                    <h2 className="text-lg font-bold mb-4">Projeção de Fluxo de Caixa (Próximos Meses)</h2>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecast.forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                                <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(val) => `R$ ${val}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                                    formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, ""]}
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                <Area name="Receita Projetada" type="monotone" dataKey="projectedIncome" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                                <Area name="Despesa Projetada" type="monotone" dataKey="projectedExpense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                                <Area name="Poupança Projetada" type="monotone" dataKey="projectedSavings" stroke="#6366F1" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Recommendations & 50-30-20 Rule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 50-30-20 Rule Distribution */}
                {recommendations?.summary?.rule50_30_20 && (
                    <div className="p-6 rounded-xl border border-white/5 bg-[#111827] shadow-lg flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold mb-1">Métricas da Regra 50-30-20</h2>
                            <p className="text-xs text-slate-400 mb-6">Divisão de despesas (Necessidades, Desejos e Poupança)</p>

                            <div className="space-y-6">
                                {/* Needs */}
                                <div>
                                    <div className="flex justify-between items-center text-sm font-semibold mb-2">
                                        <span>Necessidades (Ideal: 50%)</span>
                                        <span className={recommendations.summary.rule50_30_20.needsPercentage > 50 ? "text-red-400" : "text-emerald-400"}>
                                            {recommendations.summary.rule50_30_20.needsPercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${recommendations.summary.rule50_30_20.needsPercentage > 50 ? "bg-red-500" : "bg-emerald-500"}`}
                                            style={{ width: `${Math.min(100, recommendations.summary.rule50_30_20.needsPercentage)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Wants */}
                                <div>
                                    <div className="flex justify-between items-center text-sm font-semibold mb-2">
                                        <span>Desejos (Ideal: 30%)</span>
                                        <span className={recommendations.summary.rule50_30_20.wantsPercentage > 30 ? "text-red-400" : "text-emerald-400"}>
                                            {recommendations.summary.rule50_30_20.wantsPercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${recommendations.summary.rule50_30_20.wantsPercentage > 30 ? "bg-red-500" : "bg-emerald-500"}`}
                                            style={{ width: `${Math.min(100, recommendations.summary.rule50_30_20.wantsPercentage)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Savings */}
                                <div>
                                    <div className="flex justify-between items-center text-sm font-semibold mb-2">
                                        <span>Poupança / Investimentos (Ideal: 20%)</span>
                                        <span className={recommendations.summary.rule50_30_20.savingsPercentage < 20 ? "text-amber-400" : "text-emerald-400"}>
                                            {recommendations.summary.rule50_30_20.savingsPercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${recommendations.summary.rule50_30_20.savingsPercentage < 20 ? "bg-amber-500" : "bg-emerald-500"}`}
                                            style={{ width: `${Math.min(100, recommendations.summary.rule50_30_20.savingsPercentage)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* General Advice */}
                        {recommendations.recommendations && recommendations.recommendations.length > 0 && (
                            <div className="mt-8 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs">
                                <strong>💡 Conselhos do BudgetPath-AI:</strong>
                                <ul className="list-disc pl-4 mt-2 space-y-1.5">
                                    {recommendations.recommendations.map((adv, i) => (
                                        <li key={i} className={adv.type === "warning" ? "text-amber-300" : "text-indigo-300"}>
                                            <strong>{adv.category !== "Geral" ? `[${adv.category}] ` : ""}</strong>
                                            {adv.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Category Optimization Limits */}
                {recommendations && recommendations.budgets && recommendations.budgets.length > 0 && (
                    <div className="p-6 rounded-xl border border-white/5 bg-[#111827] shadow-lg">
                        <h2 className="text-lg font-bold mb-1">Limites Orçamentários Recomendados</h2>
                        <p className="text-xs text-slate-400 mb-4">Ajustes propostos com base nos seus gastos reais</p>

                        <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {recommendations.budgets.map((item, i) => {
                                const isExceeded = item.historicalAverage > item.recommendedLimit;
                                return (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div>
                                            <div className="font-semibold text-sm">{item.categoryName}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Classificação: {item.classification}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isExceeded ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                                                {isExceeded ? "Reduzir" : "OK"}
                                            </span>
                                            <div className="text-xs font-semibold mt-1">
                                                Média: R$ {item.historicalAverage.toFixed(2)} / <span className="text-slate-400">Sugestão: R$ {item.recommendedLimit.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiView;

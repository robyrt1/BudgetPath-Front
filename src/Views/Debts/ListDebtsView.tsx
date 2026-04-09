"use client";
import Loading from "@/app/(home)/home/loading";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { useFindDebtsViewModel } from "@/ViewModels/Debts/DebtsViewModel";
import { useEffect, useState } from "react";
import { FaListOl, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Installments from "./Installments"; // Importando o componente de parcelas

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pago':
    case 'Paga':
    case 'PAGA':
    case 'PAGO':
      return {
        bg: "bg-emerald-500/20 text-emerald-400",
        stripe: "border-emerald-500",
        text: "PAGO"
      };
    case 'Pendente':
    case 'PENDENTE':
      return {
        bg: "bg-amber-500/20 text-amber-400",
        stripe: "border-amber-500",
        text: "PENDENTE"
      };
    case 'Atrasado':
    case 'Atrasada':
    case 'ATRASADA':
    case 'ATRASADO':
      return {
        bg: "bg-rose-500/20 text-rose-400",
        stripe: "border-rose-500",
        text: "ATRASADO"
      };
    default:
      return {
        bg: "bg-slate-500/20 text-slate-300",
        stripe: "border-slate-500",
        text: (status || 'INVÁLIDO').toUpperCase()
      };
  }
};

const DebtList = () => {
  const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);

  const { debts, setDebts, state, setState, findDebt, isModalOpen, setSelectedDebt, openCreateModal, openEditModal, closeModal, saveDebt, confirmDelete, setIsDeleteConfirmOpen, doDelete, debtToDelete, editingDebt, isDeleteConfirmOpen, selectedDebt } = useFindDebtsViewModel();

  useEffect(() => {
    findDebt(userId);
  }, [userId]);
  console.log(debts);

  return (
    <div className="w-full min-h-screen py-10">
      <div className="max-w-[1580px] w-full mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Minhas Dívidas</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6]/10 text-[#3B82F6] font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-[#3B82F6]/20 transition-colors"
          >
            <FaPlus className="h-3 w-3" /> Nova Dívida
          </button>
        </div>

        {state === 'loading' && <Loading />}

        <div className="bg-[#111827] shadow-[0_8px_40px_rgba(0,0,0,0.12)] rounded-[24px] border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5">Descrição</th>
                <th className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5">Conta</th>
                <th className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-right">Total</th>
                <th className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-center">Parcelas</th>
                <th className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5">Vencimento</th>
                <th className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-center">Status</th>
                <th className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {debts.map(debt => {
                const badge = getStatusBadge(debt.Status || '');
                return (
                  <tr key={debt.Id} className="group transition-colors hover:bg-white/[0.02] relative">
                    <td className={`px-6 py-5 text-sm font-semibold text-slate-100 border-l-[3px] ${badge.stripe}`}>
                      {debt.Description}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-400">{debt.Account?.Name ?? '—'}</td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mr-2">Total</span>
                      <span className="text-lg font-bold text-white tracking-tight">R$ {Number(debt.TotalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-full">{debt.Installments}</span>
                    </td>
                    <td className="px-6 py-5 text-[13px] font-medium text-slate-400 whitespace-nowrap">{new Date(debt.DueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedDebt(debt)} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Ver Parcelas">
                          <FaListOl size={14} />
                        </button>
                        <button onClick={() => openEditModal(debt)} className="p-2.5 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-xl transition-colors" title="Editar Dívida">
                          <FaPen size={14} />
                        </button>
                        <button onClick={() => confirmDelete(debt)} className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors" title="Excluir Dívida">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="bg-[#111827] border border-white/10 shadow-2xl w-full max-w-xl p-8 rounded-[24px] relative z-10">
              <h3 className="text-xl font-bold text-white mb-8 tracking-tight">{editingDebt?.id ? 'Editar Dívida' : 'Nova Dívida'}</h3>
              <DebtForm debt={editingDebt} onCancel={closeModal} onSave={saveDebt} />
            </div>
          </div>
        )}

        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)}></div>
            <div className="bg-[#111827] border border-white/10 shadow-2xl w-full max-w-md p-8 rounded-[24px] relative z-10">
              <h4 className="text-xl font-bold text-white mb-2">Confirmar exclusão</h4>
              <p className="text-sm text-slate-400 mb-8">Deseja realmente excluir a dívida <strong className="text-white font-semibold">{debtToDelete?.description}</strong>?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">Cancelar</button>
                <button onClick={doDelete} className="px-5 py-2.5 rounded-xl font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        )}

        {selectedDebt && (
          <Installments debt={selectedDebt} onClose={() => setSelectedDebt(null)} />
        )}
      </div>
    </div>
  );
};

export default DebtList;

function DebtForm({ debt, onSave, onCancel }: { debt: any; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState<any>({ ...debt });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: name === 'totalAmount' || name === 'installments' ? Number(value) : value }));
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (!form.description || !form.totalAmount) return;
    onSave({ ...form });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Descrição</label>
        <input name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Total</label>
          <input name="totalAmount" type="number" step="0.01" value={form.totalAmount} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Parcelas</label>
          <input name="installments" type="number" value={form.installments} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Vencimento</label>
        <input name="dueDate" type="date" value={form.dueDate?.slice?.(0, 10) ?? ''} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">Cancelar</button>
        <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-lg shadow-blue-500/20 transition-all">Salvar</button>
      </div>
    </form>
  );
}

"use client";
import Loading from "@/app/(home)/home/loading";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { useFindDebtsViewModel } from "@/ViewModels/Debts/DebtsViewModel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Installments from "./Installments"; // Importando o componente de parcelas

const DebtList = () => {
  const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);

  const { debts, setDebts, state, setState, findDebt, isModalOpen, setSelectedDebt, openCreateModal, openEditModal, closeModal, saveDebt, confirmDelete, setIsDeleteConfirmOpen, doDelete, debtToDelete, editingDebt, isDeleteConfirmOpen, selectedDebt } = useFindDebtsViewModel();

  useEffect(() => {
    findDebt(userId);
  }, [userId]);
  console.log(debts);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Minhas Dívidas</h1>
        <div className="flex items-center gap-3">
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--foreground)] rounded hover:bg-[var(--accent)]">+ Nova Dívida</button>
        </div>
      </div>

      {state === 'loading' && <Loading />}

      <div className="bg-[var(--background)] shadow rounded-lg overflow-hidden border border-[rgba(255,255,255,0.04)]">
        <table className="w-full table-auto">
          <thead className="bg-[rgba(255,255,255,0.02)]">
            <tr>
              <th className="text-left px-4 py-3">Descrição</th>
              <th className="text-left px-4 py-3">Conta</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-center px-4 py-3">Parcelas</th>
              <th className="text-left px-4 py-3">Vencimento</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {debts.map(debt => (
              <tr key={debt.Id} className="border-t border-[rgba(255,255,255,0.03)]">
                <td className="px-4 py-3">{debt.Description}</td>
                <td className="px-4 py-3">{debt.Account?.Name ?? '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-[var(--accent)]">R$ {Number(debt.TotalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-center">{debt.Installments}</td>
                <td className="px-4 py-3">{new Date(debt.DueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{debt.Status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => setSelectedDebt(debt)} className="text-sm text-[var(--accent)] hover:underline">Parcelas</button>
                    <button onClick={() => openEditModal(debt)} className="text-sm text-[var(--primary)] hover:underline">Editar</button>
                    <button onClick={() => confirmDelete(debt)} className="text-sm text-red-500 hover:underline">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-xl p-6 relative z-10">
            <h3 className="text-xl font-semibold mb-4">{editingDebt?.id ? 'Editar Dívida' : 'Nova Dívida'}</h3>
            <DebtForm debt={editingDebt} onCancel={closeModal} onSave={saveDebt} />
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDeleteConfirmOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md p-6 relative z-10">
            <h4 className="text-lg font-semibold mb-2">Confirmar exclusão</h4>
            <p className="text-sm text-gray-600 mb-4">Deseja realmente excluir a dívida <strong>{debtToDelete?.description}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 rounded border">Cancelar</button>
              <button onClick={doDelete} className="px-4 py-2 rounded bg-red-600 text-white">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {selectedDebt && (
        <Installments debt={selectedDebt} onClose={() => setSelectedDebt(null)} />
      )}
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
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <input name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Total</label>
          <input name="totalAmount" type="number" step="0.01" value={form.totalAmount} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Parcelas</label>
          <input name="installments" type="number" value={form.installments} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Vencimento</label>
        <input name="dueDate" type="date" value={form.dueDate?.slice?.(0, 10) ?? ''} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Salvar</button>
      </div>
    </form>
  );
}

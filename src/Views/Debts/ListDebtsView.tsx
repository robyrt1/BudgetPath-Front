"use client";
import Loading from "@/app/[locale]/(private)/(home)/home/loading";
import UseAccountModel from "@/Models/Accounts/AccountsModel";
import CategoriesModel from "@/Models/Categories/CategoriesModal";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { useFindDebtsViewModel } from "@/ViewModels/Debts/DebtsViewModel";
import { useEffect, useState } from "react";
import { FaListOl, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Button from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import Installments from "./Installments";
import DebtForm from "./modal/debtForm";

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

  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    findDebt(userId);
    UseAccountModel.findByUser({ userId }).then(res => setAccounts(res || []));
    CategoriesModel.FindCategories({ userId }).then(res => setCategories(res.Data || []));
  }, [userId]);

  return (
    <div className="py-8">
      <div className="w-full max-w-[1645px] max-w-[1800px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Minhas Dívidas</h1>
          <Button
            onClick={openCreateModal}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FaPlus className="h-3 w-3" /> Nova Dívida
          </Button>
        </div>

        {state === 'loading' && <Loading />}

        <div className="bg-[#111827] shadow-[0_8px_40px_rgba(0,0,0,0.12)] rounded-[24px] border border-white/5 overflow-hidden">
          <Table className="w-full text-left border-collapse">
            <TableHeader className="bg-white/[0.02]">
              <TableRow>
                <TableHead className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5">Descrição</TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5">Conta</TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-right">Total</TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-center">Parcelas</TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5">Vencimento</TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-center">Status</TableHead>
                <TableHead className="px-6 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-white/5 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {debts.map(debt => {
                const badge = getStatusBadge(debt.Status || '');
                return (
                  <TableRow key={debt.Id} className="group transition-colors hover:bg-white/[0.02] relative">
                    <TableCell className={`px-6 py-5 text-sm font-semibold text-slate-100 border-l-[3px] ${badge.stripe}`}>
                      {debt.Description}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-sm font-medium text-slate-400">{debt.Account?.Name ?? '—'}</TableCell>
                    <TableCell className="px-6 py-5 text-right whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mr-2">Total</span>
                      <span className="text-lg font-bold text-white tracking-tight">R$ {Number(debt.TotalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-center">
                      <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-full">{debt.Installments}</span>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-[13px] font-medium text-slate-400 whitespace-nowrap">{new Date(debt.DueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                        {badge.text}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => setSelectedDebt(debt)} variant="ghost" size="icon" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors w-9 h-9" title="Ver Parcelas">
                          <FaListOl size={14} />
                        </Button>
                        <Button onClick={() => openEditModal(debt)} variant="ghost" size="icon" className="p-2.5 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-xl transition-colors w-9 h-9" title="Editar Dívida">
                          <FaPen size={14} />
                        </Button>
                        <Button onClick={() => confirmDelete(debt, userId)} variant="ghost" size="icon" className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors w-9 h-9" title="Excluir Dívida">
                          <FaTrash size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="bg-[#111827] border border-white/10 shadow-2xl w-full max-w-xl p-8 rounded-[24px] relative z-10">
              <h3 className="text-xl font-bold text-white mb-8 tracking-tight">{editingDebt?.id ? 'Editar Dívida' : 'Nova Dívida'}</h3>
              <DebtForm debt={editingDebt} accounts={accounts} categories={categories} onCancel={closeModal} onSave={(d) => saveDebt(d, userId)} />
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
                <Button onClick={() => setIsDeleteConfirmOpen(false)} variant="ghost">Cancelar</Button>
                <Button onClick={doDelete} variant="danger">Excluir</Button>
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

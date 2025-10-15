import { DebtsModel } from "@/Models/Debts/DebtsModel";
import { Debt } from "@/Models/Debts/Responses/FindByUser";
import { useState } from "react";

export type LoadState = 'idle' | 'loading' | 'error' | 'ready';
export const useFindDebtsViewModel = () => {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [state, setState] = useState<LoadState>('idle');

    const [selectedDebt, setSelectedDebt] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editingDebt, setEditingDebt] = useState<any>(null);
    const [debtToDelete, setDebtToDelete] = useState<any>(null)


    function closeModal() {
        setIsModalOpen(false);
        setEditingDebt(null);
    }

    return {
        debts,
        setDebts,
        state, setState,
        selectedDebt, setSelectedDebt,
        isModalOpen, setIsModalOpen,
        isDeleteConfirmOpen, setIsDeleteConfirmOpen,
        editingDebt, setEditingDebt,
        debtToDelete, setDebtToDelete,
        findDebt: async (userId: string) => {
            try {
                setState('loading');
                const data = await DebtsModel.findByUser({ userId });
                setDebts(data);
                setState('ready');
            } catch (error) {
                setState('error');
            }
        },
        openCreateModal: () => {
            setEditingDebt({ description: "", totalAmount: 0, installments: 1, dueDate: new Date().toISOString().slice(0, 10) });
            setIsModalOpen(true);
        },

        openEditModal: (debt: any) => {
            setEditingDebt({ ...debt });
            setIsModalOpen(true);
        },

        closeModal: () => closeModal(),

        saveDebt: (debt: any) => {
            if (debt.Id) {
                setDebts(prev => prev.map(d => d.Id === debt.Id ? { ...d, ...debt } : d));
            } else {
                const newDebt = { ...debt, Id: crypto.randomUUID(), CreatedAt: new Date().toISOString() };
                setDebts(prev => [newDebt, ...prev]);
            }
            closeModal();
        },

        confirmDelete: (debt: any) => {
            setDebtToDelete(debt);
            setIsDeleteConfirmOpen(true);
        },

        doDelete: () => {
            if (debtToDelete) {
                setDebts(prev => prev.filter(d => d.Id !== debtToDelete.Id));
            }
            setIsDeleteConfirmOpen(false);
            setDebtToDelete(null);
        }
    };
}


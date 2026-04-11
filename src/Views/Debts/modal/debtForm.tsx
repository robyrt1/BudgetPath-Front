import { useState } from "react";

export interface DebtFormProps {
    debt: any;
    onSave: (d: any) => void;
    onCancel: () => void;
    accounts: any[];
    categories: any[];
}

export interface DebtFormState {
    amount?: number;
    accountId: string;
    creditCardId?: string;
    categoryId: string;
    description: string;
    totalAmount: number;
    installments: number;
    dueDate: string;
}
function DebtForm({ debt, onSave, onCancel, accounts, categories }: DebtFormProps) {
    const [form, setForm] = useState<
        DebtFormState
    >({ ...debt });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm((prev: any) => {
            const updatedValue = name === 'totalAmount' || name === 'installments' || name === 'amount'
                ? Number(value)
                : value;

            const newForm = { ...prev, [name]: updatedValue };

            // Lógica de cálculo automático: Total = Valor da Parcela * Quantidade de Parcelas
            if (name === 'amount' || name === 'installments') {
                const amount = name === 'amount' ? Number(value) : (Number(prev.amount) || 0);
                const installments = name === 'installments' ? Number(value) : (Number(prev.installments) || 0);

                newForm.totalAmount = amount * installments;
            }

            return newForm;
        });
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.description || !form.totalAmount || !form.accountId || !form.categoryId) {
            alert("Preencha todos os campos obrigatórios (Descrição, Total, Conta, Categoria).");
            return;
        }
        onSave({ ...form });
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Descrição</label>
                <input name="description" value={form.description || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Conta</label>
                    <select name="accountId" value={form.accountId || ''} onChange={handleChange} className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none">
                        <option value="" disabled className="text-slate-400">Selecione uma conta</option>
                        {(accounts || []).map(acc => <option key={acc.Id} value={acc.Id}>{acc.Name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                    <select name="categoryId" value={form.categoryId || ''} onChange={handleChange} className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none">
                        <option value="" disabled className="text-slate-400">Selecione uma categoria</option>
                        {(categories || []).map(cat => <option key={cat.Id} value={cat.Id}>{cat.Descript}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Valor Parcela</label>
                    <input name="amount" type="number" step="0.01" value={form.amount || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors" placeholder="0,00" />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Parcelas</label>
                    <input name="installments" type="number" value={form.installments || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] transition-colors" placeholder="1" />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Total</label>
                    <input
                        name="totalAmount"
                        type="number"
                        step="0.01"
                        value={form.totalAmount || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-[#3B82F6]/30 rounded-xl text-[#3B82F6] font-bold focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
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

export default DebtForm;
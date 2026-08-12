import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

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
            <Input.Root>
                <Input.Label>Descrição</Input.Label>
                <Input.Field
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                />
            </Input.Root>

            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1 w-full justify-end">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Conta</label>
                    <Select.Root
                        value={form.accountId || ''}
                        onChange={(val) => {
                            setForm(prev => {
                                return { ...prev, accountId: val };
                            });
                        }}
                    >
                        <Select.Trigger displayValue={accounts.find(acc => acc.Id === form.accountId)?.Name || "Selecione uma conta"} />
                        <Select.Content>
                            {(accounts || []).map(acc => (
                                <Select.Option key={acc.Id} value={acc.Id}>{acc.Name}</Select.Option>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
                <div className="flex flex-col gap-1 w-full justify-end">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                    <Select.Root
                        value={form.categoryId || ''}
                        onChange={(val) => {
                            setForm(prev => {
                                return { ...prev, categoryId: val };
                            });
                        }}
                    >
                        <Select.Trigger displayValue={categories.find(cat => cat.Id === form.categoryId)?.Descript || "Selecione uma categoria"} />
                        <Select.Content>
                            {(categories || []).map(cat => (
                                <Select.Option key={cat.Id} value={cat.Id}>{cat.Descript}</Select.Option>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                <Input.Root>
                    <Input.Label>Valor Parcela</Input.Label>
                    <Input.Field
                        name="amount"
                        type="number"
                        step="0.01"
                        value={form.amount || ''}
                        onChange={handleChange}
                        placeholder="0,00"
                    />
                </Input.Root>
                <Input.Root>
                    <Input.Label>Parcelas</Input.Label>
                    <Input.Field
                        name="installments"
                        type="number"
                        value={form.installments || ''}
                        onChange={handleChange}
                        placeholder="1"
                    />
                </Input.Root>
                <Input.Root>
                    <Input.Label>Total</Input.Label>
                    <Input.Field
                        name="totalAmount"
                        type="number"
                        step="0.01"
                        value={form.totalAmount || ''}
                        onChange={handleChange}
                        className="bg-white/10 border border-[#3B82F6]/30 text-[#3B82F6] font-bold"
                    />
                </Input.Root>
            </div>

            <Input.Root>
                <Input.Label>Vencimento</Input.Label>
                <Input.Field
                    name="dueDate"
                    type="date"
                    value={form.dueDate?.slice?.(0, 10) ?? ''}
                    onChange={handleChange}
                    className="[color-scheme:dark]"
                />
            </Input.Root>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" variant="primary">Salvar</Button>
            </div>
        </form>
    );
}

export default DebtForm;
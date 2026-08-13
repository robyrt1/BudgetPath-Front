import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingAccount: { Id: string; Name: string; Balance: number } | null;
    onSave: (name: string, balance: number) => Promise<void>;
    onDelete?: () => Promise<void>;
}

export default function AccountModal({ isOpen, onClose, editingAccount, onSave, onDelete }: AccountModalProps) {
    const t = useTranslations('accounts');
    const [accountName, setAccountName] = useState("");
    const [accountBalance, setAccountBalance] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (editingAccount) {
                setAccountName(editingAccount.Name);
                setAccountBalance(editingAccount.Balance.toString());
            } else {
                setAccountName("");
                setAccountBalance("");
            }
            setErrorMsg("");
            setIsDeleting(false);
        }
    }, [isOpen, editingAccount]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const balanceNum = parseFloat(accountBalance) || 0;
            await onSave(accountName, balanceNum);
            onClose();
        } catch (err: any) {
            setErrorMsg(t('errorSave'));
        }
    };

    const handleDeleteClick = async () => {
        if (onDelete) {
            try {
                await onDelete();
                onClose();
            } catch (err: any) {
                setErrorMsg(t('errorDelete'));
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#111827] border border-white/10 rounded-[28px] max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="absolute top-4 right-4 h-8 w-8 text-slate-400 hover:text-white"
                >
                    ✕
                </Button>
                <h3 className="text-lg font-bold text-white mb-6">
                    {editingAccount ? "Editar Conta Bancária" : "Nova Conta Bancária"}
                </h3>
                {errorMsg && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                        {errorMsg}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input.Root>
                        <Input.Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Nome da Conta
                        </Input.Label>
                        <Input.Field
                            type="text"
                            required
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="Ex: Nubank Principal, Itaú"
                        />
                    </Input.Root>

                    <Input.Root>
                        <Input.Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Saldo Inicial (R$)
                        </Input.Label>
                        <Input.Field
                            type="number"
                            step="0.01"
                            required
                            value={accountBalance}
                            onChange={(e) => setAccountBalance(e.target.value)}
                            placeholder="0,00"
                        />
                    </Input.Root>

                    <div className="flex flex-col gap-2 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 text-sm font-semibold rounded-xl"
                        >
                            Salvar Alterações
                        </Button>
                        {editingAccount && onDelete && (
                            <>
                                {!isDeleting ? (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsDeleting(true)}
                                        className="w-full py-3 text-sm font-semibold text-rose-400 border border-rose-500/20 rounded-xl"
                                    >
                                        Excluir Conta
                                    </Button>
                                ) : (
                                    <div className="border border-rose-500/30 bg-rose-500/5 rounded-xl p-3 flex flex-col gap-2 text-center animate-in fade-in duration-200">
                                        <p className="text-[11px] text-rose-400 font-medium leading-relaxed">Tem certeza? Todos os cartões associados serão perdidos.</p>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="danger"
                                                onClick={handleDeleteClick}
                                                className="flex-1 py-2 text-xs font-bold"
                                            >
                                                Confirmar
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => setIsDeleting(false)}
                                                className="flex-1 py-2 text-xs font-bold"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

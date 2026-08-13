import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CreditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    accountId: string; // The account to associate the card to (used for create)
    editingCard: {
        Id: string;
        Name: string;
        Limit: number;
        Maturity: number;
        Closing: number;
    } | null;
    onSave: (name: string, limit: number, maturity: number, closing: number) => Promise<void>;
    onDelete?: () => Promise<void>;
}

export default function CreditCardModal({ isOpen, onClose, accountId, editingCard, onSave, onDelete }: CreditCardModalProps) {
    const t = useTranslations('accounts');
    const [cardName, setCardName] = useState("");
    const [cardLimit, setCardLimit] = useState("");
    const [cardMaturity, setCardMaturity] = useState("");
    const [cardClosing, setCardClosing] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (editingCard) {
                setCardName(editingCard.Name);
                setCardLimit(editingCard.Limit.toString());
                setCardMaturity(editingCard.Maturity.toString());
                setCardClosing(editingCard.Closing.toString());
            } else {
                setCardName("");
                setCardLimit("");
                setCardMaturity("");
                setCardClosing("");
            }
            setErrorMsg("");
            setIsDeleting(false);
        }
    }, [isOpen, editingCard]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        const maturityNum = parseInt(cardMaturity);
        const closingNum = parseInt(cardClosing);

        if (isNaN(maturityNum) || maturityNum < 1 || maturityNum > 31) {
            setErrorMsg(t('errorMaturity'));
            return;
        }

        if (isNaN(closingNum) || closingNum < 1 || closingNum > 31) {
            setErrorMsg(t('errorClosing'));
            return;
        }

        try {
            const limitNum = parseFloat(cardLimit) || 0;
            await onSave(cardName, limitNum, maturityNum, closingNum);
            onClose();
        } catch (err: any) {
            setErrorMsg(t('errorSaveCard'));
        }
    };

    const handleDeleteClick = async () => {
        if (onDelete) {
            try {
                await onDelete();
                onClose();
            } catch (err: any) {
                setErrorMsg(t('errorDeleteCard'));
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
                    {editingCard ? "Editar Cartão de Crédito" : "Novo Cartão de Crédito"}
                </h3>
                {errorMsg && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                        {errorMsg}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input.Root>
                        <Input.Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Nome do Cartão
                        </Input.Label>
                        <Input.Field
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Ex: Nubank Black, Visa"
                        />
                    </Input.Root>

                    <Input.Root>
                        <Input.Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Limite (R$)
                        </Input.Label>
                        <Input.Field
                            type="number"
                            step="0.01"
                            required
                            value={cardLimit}
                            onChange={(e) => setCardLimit(e.target.value)}
                            placeholder="0,00"
                        />
                    </Input.Root>

                    <div className="grid grid-cols-2 gap-4">
                        <Input.Root>
                            <Input.Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Dia Fechamento
                            </Input.Label>
                            <Input.Field
                                type="number"
                                min="1"
                                max="31"
                                required
                                value={cardClosing}
                                onChange={(e) => setCardClosing(e.target.value)}
                                placeholder="1-31"
                            />
                        </Input.Root>

                        <Input.Root>
                            <Input.Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Dia Vencimento
                            </Input.Label>
                            <Input.Field
                                type="number"
                                min="1"
                                max="31"
                                required
                                value={cardMaturity}
                                onChange={(e) => setCardMaturity(e.target.value)}
                                placeholder="1-31"
                            />
                        </Input.Root>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 text-sm font-semibold rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] shadow-blue-500/20"
                        >
                            Salvar Alterações
                        </Button>
                        {editingCard && onDelete && (
                            <>
                                {!isDeleting ? (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsDeleting(true)}
                                        className="w-full py-3 text-sm font-semibold text-rose-400 border border-rose-500/20 rounded-xl"
                                    >
                                        Excluir Cartão
                                    </Button>
                                ) : (
                                    <div className="border border-rose-500/30 bg-rose-500/5 rounded-xl p-3 flex flex-col gap-2 text-center animate-in fade-in duration-200">
                                        <p className="text-[11px] text-rose-400 font-medium leading-relaxed">Tem certeza? Todos os dados vinculados a este cartão serão removidos.</p>
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

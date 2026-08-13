import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import UseFindCategoriesViewModel from "@/ViewModels/Categories/FindCategoriesViewModel";
import { Category, SubCategories } from "@/Models/Categories/Responses/FindCategoriesResponse";
import { Icon } from "@iconify/react";
import { UrlsService } from "@/shared/Constants/URLS";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function SettingsView() {
    const t = useTranslations('settings');
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const email = useSelector((state: { auth: AuthState }) => state.auth.email);
    const { categories, find } = UseFindCategoriesViewModel({ UserId: userId });

    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        find();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
        if (userId) {
            // 1. Try local cache first for instant load
            const savedValue = localStorage.getItem(`budgetpath_card_payment_category_id_${userId}`);
            if (savedValue) {
                setSelectedCategoryId(savedValue);
            }

            // 2. Fetch from DB to ensure sync
            const fetchSettings = async () => {
                try {
                    const res = await fetch(UrlsService.URL_FINANCE_API + `User/${userId}/cardPaymentCategory`).then(r => r.json());
                    if (res && res.cardPaymentCategoryId) {
                        setSelectedCategoryId(res.cardPaymentCategoryId);
                        localStorage.setItem(`budgetpath_card_payment_category_id_${userId}`, res.cardPaymentCategoryId);
                    }
                } catch (err) {
                    console.error("Failed to load user preferences from DB:", err);
                }
            };
            fetchSettings();
        }
    }, [userId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMsg("");

        if (!selectedCategoryId) {
            setErrorMsg(t('errorSelect'));
            return;
        }

        try {
            // Save to DB
            const res = await fetch(UrlsService.URL_FINANCE_API + `User/${userId}/cardPaymentCategory`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardPaymentCategoryId: selectedCategoryId })
            });

            if (!res.ok) throw new Error("Database save failed");

            // Save to LocalStorage
            localStorage.setItem(`budgetpath_card_payment_category_id_${userId}`, selectedCategoryId);
            setSuccessMsg(t('successSave'));
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            setErrorMsg(t('errorSave'));
        }
    };

    // Flatten all categories and subcategories of type DESPESA to build a flat select list
    const despesaCategories: { id: string; name: string }[] = [];
    categories
        .filter(cat => cat.Group?.Descript === "DESPESA")
        .forEach((cat: Category) => {
            despesaCategories.push({ id: cat.Id, name: cat.Descript });
            if (cat.SubCategories && cat.SubCategories.length > 0) {
                cat.SubCategories.forEach((sub: SubCategories) => {
                    despesaCategories.push({ id: sub.Id, name: `└─ ${sub.Descript}` });
                });
            }
        });

    const getSelectedCategoryLabel = () => {
        const found = despesaCategories.find(c => c.id === selectedCategoryId);
        return found ? found.name : "";
    };

    return (
        <div className="w-full min-h-screen max-w-[800px] mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon icon="mingcute:settings-6-line" className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{t('title')}</h2>
                    <p className="text-xs text-slate-400 font-medium">{t('subtitle')}</p>
                </div>
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-[28px] p-6 lg:p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Icon icon="mingcute:card-pay-line" className="h-5 w-5 text-indigo-400" />
                    {t('cardPreferences')}
                </h3>

                {successMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Icon icon="mingcute:check-circle-line" className="h-4 w-4" />
                        {successMsg}
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Icon icon="mingcute:close-circle-line" className="h-4 w-4" />
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {t('categoryLabel')}
                        </label>
                        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                            {t('categoryDesc')}
                        </p>
                        
                        {despesaCategories.length > 0 ? (
                            <Select.Root
                                value={selectedCategoryId}
                                onChange={setSelectedCategoryId}
                                placeholder={t('placeholder')}
                            >
                                <Select.Trigger displayValue={getSelectedCategoryLabel()} />
                                <Select.Content>
                                    {despesaCategories.map(cat => (
                                        <Select.Option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </Select.Option>
                                    ))}
                                </Select.Content>
                            </Select.Root>
                        ) : (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-slate-500">
                                {t('loading')}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            className="px-6 py-3"
                        >
                            {t('saveButton')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

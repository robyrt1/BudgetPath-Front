import { Category, SubCategories } from "@/Models/Categories/Responses/FindCategoriesResponse";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { setCategories } from "@/Redux/Slices/CategoriesSlice";
import UseFindCategoriesViewModel from "@/ViewModels/Categories/FindCategoriesViewModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import Select from "./Select";

interface SelectCategoryProps {
    selectedCategoryId: string;
    transactionType: string,
    setSelectedCategoryId: (categoryId: string) => void;
}

const SelectCategory = ({ selectedCategoryId, setSelectedCategoryId, transactionType }: SelectCategoryProps) => {
    const t = useTranslations('addTransaction');
    const dispatch = useDispatch();
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { categories, find } = UseFindCategoriesViewModel({ UserId: userId });

    const [seleteSubCategories, setSeleteSubCategories] = useState<SubCategories[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    useEffect(() => {
        find();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
        if (categories.length > 0) {
            dispatch(setCategories(categories));
        }
    }, [categories, dispatch]);

    useEffect(() => {
        if (!selectedCategoryId || categories.length === 0) return;

        // Try to find a category that matches selectedCategoryId
        const matchingCategory = categories.find(cat => cat.Id === selectedCategoryId);
        if (matchingCategory) {
            const stringified = JSON.stringify(matchingCategory);
            if (selectedCategory !== stringified) {
                setSelectedCategory(stringified);
                setSeleteSubCategories(matchingCategory.SubCategories || []);
            }
            return;
        }

        // Try to find a subcategory that matches selectedCategoryId
        for (const cat of categories) {
            const matchingSub = (cat.SubCategories || []).find(sub => sub.Id === selectedCategoryId);
            if (matchingSub) {
                const stringified = JSON.stringify(cat);
                if (selectedCategory !== stringified) {
                    setSelectedCategory(stringified);
                    setSeleteSubCategories(cat.SubCategories || []);
                }
                break;
            }
        }
    }, [selectedCategoryId, categories, selectedCategory]);

    const handleCategoryChange = (value: string) => {
        if (value) {
            const category = JSON.parse(value);
            setSelectedCategoryId(category.Id);
            setSelectedCategory(value);
            setSeleteSubCategories(category.SubCategories);
        }
    };
    const handleSubCategoryChange = (value: string) => {
        setSelectedCategoryId(value);
    };

    const parentCategoryId = selectedCategory ? JSON.parse(selectedCategory).Id : "";
    const isSubCategorySelected = selectedCategoryId && selectedCategoryId !== parentCategoryId;

    const displayCategory = selectedCategory ? JSON.parse(selectedCategory).Descript : "";
    const displaySubCategory = isSubCategorySelected ? (seleteSubCategories || []).find(sub => sub.Id === selectedCategoryId)?.Descript : "";

    return (
        <div className="flex flex-col gap-2 w-full">
            <Select.Root
                value={selectedCategory}
                onChange={handleCategoryChange}
                placeholder={t('selectCategory')}
            >
                <Select.Trigger displayValue={displayCategory} />
                <Select.Content>
                    {categories
                        .filter(item => [transactionType].includes(item.Group.Descript))
                        .map((category: Category) => (
                            <Select.Option key={category.Id} value={JSON.stringify(category)}>
                                {category.Descript}
                            </Select.Option>
                        ))}
                </Select.Content>
            </Select.Root>

            {selectedCategory && seleteSubCategories && seleteSubCategories.length > 0 && (
                <Select.Root
                    value={isSubCategorySelected ? selectedCategoryId : ""}
                    onChange={handleSubCategoryChange}
                    placeholder={t('selectSubCategory')}
                >
                    <Select.Trigger displayValue={displaySubCategory} />
                    <Select.Content>
                        {seleteSubCategories.map((sub: SubCategories) => (
                            <Select.Option key={sub.Id} value={sub.Id}>
                                {sub.Descript}
                            </Select.Option>
                        ))}
                    </Select.Content>
                </Select.Root>
            )}
        </div>
    );
};

export default SelectCategory;

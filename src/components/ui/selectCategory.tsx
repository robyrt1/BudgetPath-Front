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
    }, [userId, find]);

    useEffect(() => {
        if (categories.length > 0) {
            dispatch(setCategories(categories));
        }
    }, [categories, dispatch]);

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

    const displayCategory = selectedCategory ? JSON.parse(selectedCategory).Descript : "";
    const displaySubCategory = selectedCategoryId ? (seleteSubCategories || []).find(sub => sub.Id === selectedCategoryId)?.Descript : "";

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

            {selectedCategoryId && seleteSubCategories && seleteSubCategories.length > 0 && (
                <Select.Root
                    value={selectedCategoryId}
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

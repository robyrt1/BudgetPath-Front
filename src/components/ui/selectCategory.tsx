import { Category, SubCategories } from "@/Models/Categories/Responses/FindCategoriesResponse";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { setCategories } from "@/Redux/Slices/CategoriesSlice";
import UseFindCategoriesViewModel from "@/ViewModels/Categories/FindCategoriesViewModel";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import CustomSelect from "./CustomSelect";

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

    const categoryOptions = useMemo(() => {
        return categories
            .filter(item => [transactionType].includes(item.Group.Descript))
            .map((category: Category) => ({
                value: JSON.stringify(category),
                label: category.Descript,
            }));
    }, [categories, transactionType]);

    const subCategoryOptions = useMemo(() => {
        return (seleteSubCategories || []).map((sub: SubCategories) => ({
            value: sub.Id,
            label: sub.Descript,
        }));
    }, [seleteSubCategories]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <CustomSelect
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder={t('selectCategory')}
            />

            {selectedCategoryId && seleteSubCategories && seleteSubCategories.length > 0 && (
                <CustomSelect
                    value={selectedCategoryId}
                    onChange={handleSubCategoryChange}
                    options={subCategoryOptions}
                    placeholder={t('selectSubCategory')}
                />
            )}
        </div>
    );
};

export default SelectCategory;

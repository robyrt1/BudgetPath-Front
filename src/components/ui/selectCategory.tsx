import { SubCategories } from "@/Models/Categories/Responses/FindCategoriesResponse";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { setCategories } from "@/Redux/Slices/CategoriesSlice";
import UseFindCategoriesViewModel from "@/ViewModels/Categories/FindCategoriesViewModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SelectCategoryProps {
    selectedCategoryId: string;
    transactionType: string,
    setSelectedCategoryId: (categoryId: string) => void;
}

const SelectCategory = ({ selectedCategoryId, setSelectedCategoryId, transactionType }: SelectCategoryProps) => {
    const dispatch = useDispatch();
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { categories, find } = UseFindCategoriesViewModel({ UserId: userId });

    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [seleteSubCategories, setSeleteSubCategories] = useState<SubCategories[]>([])
    const [selectedCategory, setSelectedCategory] = useState<any>();

    useEffect(() => {
        find();
    }, [userId]);

    useEffect(() => {
        if (categories.length > 0) {
            dispatch(setCategories(categories));
        }
    }, [categories]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = JSON.parse(event.target.value);
        setSelectedCategoryId(category.Id);
        setSelectedCategory(event.target.value);
        setSeleteSubCategories(category.SubCategories);
        setSelectedSubCategory('');
    };
    const handleSubCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(event.target.value);
        setSelectedSubCategory(event.target.value);
    };

    return (
        <div>
            {(
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.filter(item => {
                        return [transactionType].includes(item.Group.Descript)
                    }).map((category: any) => (
                        <option key={category.Id} value={JSON.stringify(category)}>
                            {category.Descript}
                        </option>
                    ))}
                </select>
            )}

            {selectedCategoryId && seleteSubCategories ? (
                <div>
                    <select
                        value={selectedCategoryId}
                        onChange={handleSubCategoryChange}
                        className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="">Selecione uma Sub-Categoria</option>
                        {seleteSubCategories.map((category: any) => (
                            <option key={category.Id} value={category.Id}>
                                {category.Descript}
                            </option>
                        )) ?? []}
                    </select>
                </div>
            ) : ''}
        </div>
    );
};

export default SelectCategory;

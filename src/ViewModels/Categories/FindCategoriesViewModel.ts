import CategoriesModel from "@/Models/Categories/CategoriesModal";
import { Category } from "@/Models/Categories/Responses/FindCategoriesResponse";
import { setCategories } from "@/Redux/Slices/CategoriesSlice";
import { get, stubTrue } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IFindCategoriesProps, IUseFindCategoriesViewModel } from "./Types/FindCategoriesViewModel.type";


const UseFindCategoriesViewModel = (props: IFindCategoriesProps): IUseFindCategoriesViewModel => {
    const dispatch = useDispatch();
    const [error, SetError] = useState(null);
    const [categories, SetCategories] = useState<Category[]>([]);

    return {
        categories,
        SetCategories,
        error,
        find: async () => {

            const response = await CategoriesModel.FindCategories({ userId: props.UserId });
            if (!get(response, 'Succeeded', stubTrue())) {
                const message = get(response, 'details', null)
                SetError(message);
            }
            SetCategories(response.Data)

            dispatch(setCategories(categories));
            return;
        }
    }
}

export default UseFindCategoriesViewModel;
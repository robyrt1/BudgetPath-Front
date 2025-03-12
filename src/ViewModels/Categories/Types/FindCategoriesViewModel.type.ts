import { Category } from "@/Models/Categories/Responses/FindCategoriesResponse";

export interface IFindCategoriesProps {
    UserId: string,
}

export interface IUseFindCategoriesViewModel {
    error: any;
    categories: Category[],
    SetCategories: any
    find: () => void
}
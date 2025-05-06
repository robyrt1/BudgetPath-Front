import { UrlsService } from "@/shared/Constants/URLS";
import { RequestCreateCategory } from "./Requests/CreateCatgory";
import { RequestFindCategories } from "./Requests/FindCategories";
import { ResponseFindCategories } from "./Responses/FindCategoriesResponse";


const CategoriesModel = {
    FindCategories: async (request: RequestFindCategories): Promise<ResponseFindCategories> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + `CategoriesOData?$expand=data($expand=SubCategories,Group;$filter=ParentId eq null and (UserId eq ${request.userId} or UserId eq null))`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result = await response.json();
        return result;
    },

    create: async (request: RequestCreateCategory): Promise<void | { error: string }> => {
        try {
            const response = await fetch(UrlsService.URL_FINANCE_API + `CategoriesOData`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        } catch (error) {
            return { error: String(error) }
        }
    }
}


export default CategoriesModel;
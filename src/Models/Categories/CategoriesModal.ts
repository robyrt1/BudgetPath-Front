import { UrlsService } from "@/shared/Constants/URLS";
import { RequestFindCategories } from "./Requests/FindCategories";
import { ResponseFindCategories } from "./Responses/FindCategoriesResponse";


const CategoriesModel = {
    FindCategories: async (request: RequestFindCategories): Promise<ResponseFindCategories> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + `CategoriesOData?$expand=data($expand=SubCategories;$filter=ParentId eq null and (UserId eq ${request.userId} or UserId eq null))`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result = await response.json();
        return result;
    }
}


export default CategoriesModel;
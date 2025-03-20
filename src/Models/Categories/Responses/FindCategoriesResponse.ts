export interface ResponseFindCategories {
    Data: Category[],
    PageNumber: number;
    PageSize: number,
    TotalPages: number,
    TotalRecords: number,
    Succeeded: boolean,
    Errors: any,
    Message: string | null
}

export interface Category {
    Id: string,
    Descript: string,
    GroupId: string,
    UserId: string | null,
    ParentId: string | null
    SubCategories: SubCategories[] | null,
    children?: any

}
export interface SubCategories {
    Id: string,
    Descript: string,
    GroupId: string,
    UserId: string | null,
    ParentId: string | null
}
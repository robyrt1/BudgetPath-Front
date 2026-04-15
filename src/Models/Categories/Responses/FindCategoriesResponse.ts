export interface ResponseFindCategories {
    Data: Category[],
    PageNumber: number;
    PageSize: number,
    TotalPages: number,
    TotalRecords: number,
    Succeeded: boolean,
    Errors: unknown,
    Message: string | null
}

export interface Category {
    Id: string,
    Descript: string,
    GroupId: string,
    Group: {
        Id: string,
        Descript: string,
        CREATED_AT: string
    }
    UserId: string | null,
    ParentId: string | null
    SubCategories: SubCategories[] | null,
    children?: unknown

}
export interface SubCategories {
    Id: string,
    Descript: string,
    GroupId: string,
    UserId: string | null,
    ParentId: string | null
}
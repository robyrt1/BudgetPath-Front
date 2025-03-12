import { Category } from "@/Models/Categories/Responses/FindCategoriesResponse";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const InitalState: Category[] = [{
    Descript: '',
    GroupId: '',
    Id: '',
    ParentId: '',
    UserId: '',
}]

const CategoriesSlice = createSlice({
    name: 'categories',
    initialState: [...InitalState],
    reducers: {
        setCategories: (state: any, action: PayloadAction<Category[] | null>) => {
            if (action.payload) {
                state = action.payload
            }
        }
    }
})

export const { setCategories } = CategoriesSlice.actions;
export default CategoriesSlice.reducer
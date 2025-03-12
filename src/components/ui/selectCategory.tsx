import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { setCategories } from "@/Redux/Slices/CategoriesSlice";
import UseFindCategoriesViewModel from "@/ViewModels/Categories/FindCategoriesViewModel";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SelectCategoryProps {
    selectedCategoryId: string;
    setSelectedCategoryId: (categoryId: string) => void;
}

const SelectCategory = ({ selectedCategoryId, setSelectedCategoryId }: SelectCategoryProps) => {
    const dispatch = useDispatch();
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { categories, find } = UseFindCategoriesViewModel({ UserId: userId });

    // const [selectedRows, setSelectedRows] = useState<any[]>([]);

    useEffect(() => {
        find();
    }, [userId]);

    useEffect(() => {
        if (categories.length > 0) {
            dispatch(setCategories(categories));
        }
    }, [categories]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(event.target.value);
    };

    // const columnDefs = [
    //     { field: "Descript", headerName: "Descrição", cellRenderer: "agGroupCellRenderer", checkboxSelection: true },
    //     // { field: "Id", headerName: "ID", hide: true },
    //     // { field: "GroupId", headerName: "Grupo", hide: true }
    // ];

    // const getDataPath = (data: any) => {
    //     if (data.ParentId == null) {
    //         return [data.Descript];
    //     }
    //     return [categories.find((c: any) => c.Id === data.ParentId)?.Descript, data.Descript]; // Subcategorias
    // };

    // const onSelectionChanged = (event: any) => {
    //     const selectedNodes = event.api.getSelectedNodes();
    //     const selectedData = selectedNodes.map((node: any) => node.data);
    //     setSelectedRows(selectedData);
    //     console.log("Selecionados:", selectedData);
    // };

    return (
        <div>
            <select value={selectedCategoryId} onChange={handleCategoryChange}>
                <option value="">Selecione uma categoria</option>
                {categories.map((category: any) => (
                    <option key={category.Id} value={category.Id}>
                        {category.Descript}
                    </option>
                ))}
            </select>

            {/* <div className="ag-theme-alpine" style={{ height: 300, width: "300px" }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={categories.flatMap(category => [
                        { ...category, isCategory: true },
                        ...(category.SubCategories || []).map(sub => ({ ...sub, ParentDescript: category.Descript })) // Adiciona as subcategorias
                    ]) as any}
                    treeData={true}
                    animateRows={true}
                    groupDefaultExpanded={1}
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                    getDataPath={getDataPath}
                />
            </div> */}
        </div>
    );
};

export default SelectCategory;

import { EditIcon } from "@/shared/Icons/EditIcon";
import { DefaultMenuItem, GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";

export const getContextMenuItems = (
    params: GetContextMenuItemsParams
): (DefaultMenuItem | MenuItemDef)[] => {
    const result: (DefaultMenuItem | MenuItemDef)[] = [
        {
            name: "Edit",
            action: () => {
                // Your edit action logic
                console.log('ActionParams: ', params.node?.data)
            },
            icon: EditIcon(),
            cssClasses: ["red", "bold"],
        },
        "copy",
        "separator",
        "chartRange",
        "excelExport",
        "csvExport",
        "clearPinned",
    ];

    return result;
};

import { NameAction, NameState } from "../Type/RegisterUserReduceType";

export const NameReducer = (state: NameState, action: NameAction) => {
    switch (action.type) {
        case "SET_NAME":
            return {
                ...state,
                name: action.payload,
                error: action.payload ?  null : "Preencher nome",
            };
        default:
            return state;
    }
}
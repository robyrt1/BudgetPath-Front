import { ActionEmail, EmailState, PasswordAction, PasswordState } from "../Type/AuthenticationReducerType";
import isValidEmail from "../Validators/IsValidEmail";

export const AuthenticationActionsType = {
    SET_EMAIL: "SET_EMAIL",
    SET_PASSWORD: "SET_PSSWORD"
}

export const EmailReducer = (state: EmailState, action: ActionEmail) => {
    switch (action.type) {
        case "SET_EMAIL":
            return {
                ...state,
                email: action.payload,
                error: isValidEmail(action.payload) ? null : "Email inválido.",
            };
        default:
            return state;
    }
}


export const PasswordReducer = (state: PasswordState, action: PasswordAction): PasswordState => {
    switch (action.type) {
        case "SET_PASSWORD":
            return {
                ...state,
                password: action.payload,
                error: action.payload.length < 6 ? "A senha deve ter pelo menos 6 caracteres." : null,
            };
        default:
            return state;
    }
};

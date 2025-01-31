export type PasswordState = {
    password: string;
    error: string | null;
};
export type PasswordAction = { type: "SET_PASSWORD"; payload: string };


export type EmailState = {
    email: string;
    error: string | null;
};
export type ActionEmail = { type: "SET_EMAIL"; payload: string };

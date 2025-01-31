
export type NameState = {
    name: string;
    error: string | null;
};
export type NameAction = { type: "SET_NAME"; payload: string };
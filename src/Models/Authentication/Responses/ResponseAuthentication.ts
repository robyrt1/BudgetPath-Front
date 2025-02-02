export type ResponseAuthentication  = {
    token: string,
    name: string;
}

export type ErrorAuthentication  = {
    status?: boolean, detail?: any
}
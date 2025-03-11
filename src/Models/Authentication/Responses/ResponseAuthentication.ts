export type ResponseAuthentication = {
    status: boolean;
    details: {
        token: string,
        name: string;
        userId: string;
    } | any
}

export type ErrorAuthentication = {
    status: boolean, details: any
}
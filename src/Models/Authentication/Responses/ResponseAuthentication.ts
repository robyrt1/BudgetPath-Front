export interface AuthDetails {
    token: string;
    name: string;
    userId: string;
}

export type ResponseAuthentication = {
    status: boolean;
    details: AuthDetails | unknown;
}

export type ErrorAuthentication = {
    status: boolean;
    details: unknown;
}
export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    isOperator: boolean;
    isVerified: boolean;
}
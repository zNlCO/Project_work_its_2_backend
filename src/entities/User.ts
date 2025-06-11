export class User {
    id: string;
    username: string;
    email: string;
    password: string;
    isOperator: string;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
} 
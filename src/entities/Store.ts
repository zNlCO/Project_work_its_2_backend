export class Store {
    id: number;
    name: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    phone: string;
    email: string;
    openingHours: {
        open: string;
        close: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Store>) {
        Object.assign(this, data);
    }
} 
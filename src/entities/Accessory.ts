export class Accessory {
    id: number;
    name: string;
    description: string;
    type: string;  // e.g., helmet, lock, light
    price: number;
    quantity: number;
    storeId: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Accessory>) {
        Object.assign(this, data);
    }
} 
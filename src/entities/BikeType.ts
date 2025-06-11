export class BikeType {
    id: number;
    model: string;
    brand: string;
    size: string;
    type: string;  // e.g., Mountain, Road, City
    hourlyPrice: number;
    description: string;
    specifications: {
        frameType: string;
        wheelSize: string;
        gears: number;
        weight: number;  // in kg
    };
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<BikeType>) {
        Object.assign(this, data);
    }
} 
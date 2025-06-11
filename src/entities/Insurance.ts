export class Insurance {
    id: number;
    name: string;
    description: string;
    coverage: {
        theft: boolean;
        damage: boolean;
        thirdPartyLiability: boolean;
    };
    price: number;  // price per day
    terms: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Insurance>) {
        Object.assign(this, data);
    }
} 
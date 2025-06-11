import { User } from './User';
import { Bike } from './Bike';
import { Insurance } from './Insurance';
import { Accessory } from './Accessory';

export class Rental {
    id: number;
    userId: number;
    bikeId: number;
    startDate: Date;
    endDate: Date;
    actualReturnDate?: Date;
    insuranceId?: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    totalCost: number;
    deposit: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;

    // References to related entities
    user?: User;
    bike?: Bike;
    insurance?: Insurance;
    accessories: Accessory[] = [];

    constructor(data: Partial<Rental>) {
        Object.assign(this, data);
    }
} 
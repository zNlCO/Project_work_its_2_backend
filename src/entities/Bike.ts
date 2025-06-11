import { BikeType } from './BikeType';
import { Store } from './Store';

export class Bike {
    id: number;
    bikeTypeId: number;
    storeId: number;
    status: 'available' | 'rented' | 'maintenance' | 'retired';
    serialNumber: string;
    purchaseDate: Date;
    lastMaintenanceDate: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;

    // References to related entities
    bikeType?: BikeType;
    store?: Store;

    constructor(data: Partial<Bike>) {
        Object.assign(this, data);
    }
} 
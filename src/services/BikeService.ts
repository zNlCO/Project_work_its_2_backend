import { Bike } from '../entities/Bike';
import { BikeModel } from '../models/BikeModel';
import { BikeTypeModel } from '../models/BikeTypeModel';
import { StoreModel } from '../models/StoreModel';

export class BikeService {
    private bikeModel: BikeModel;
    private bikeTypeModel: BikeTypeModel;
    private storeModel: StoreModel;

    constructor() {
        this.bikeModel = new BikeModel();
        this.bikeTypeModel = new BikeTypeModel();
        this.storeModel = new StoreModel();
    }

    async getAllBikes(): Promise<Bike[]> {
        return this.bikeModel.findAll();
    }

    async getBikeById(id: number): Promise<Bike | null> {
        return this.bikeModel.findById(id);
    }

    async createBike(bikeData: Partial<Bike>): Promise<Bike> {
        // Validate required fields
        if (!bikeData.bikeTypeId || !bikeData.storeId || !bikeData.serialNumber) {
            throw new Error('Missing required fields: bikeTypeId, storeId, or serialNumber');
        }

        // Verify that bikeType exists
        const bikeType = await this.bikeTypeModel.findById(bikeData.bikeTypeId);
        if (!bikeType) {
            throw new Error('BikeType not found');
        }

        // Verify that store exists
        const store = await this.storeModel.findById(bikeData.storeId);
        if (!store) {
            throw new Error('Store not found');
        }

        // Validate serial number format and uniqueness
        if (!this.isValidSerialNumber(bikeData.serialNumber)) {
            throw new Error('Invalid serial number format');
        }

        return this.bikeModel.create(bikeData);
    }

    async updateBike(id: number, bikeData: Partial<Bike>): Promise<Bike | null> {
        // Validate serial number if provided
        if (bikeData.serialNumber && !this.isValidSerialNumber(bikeData.serialNumber)) {
            throw new Error('Invalid serial number format');
        }

        // Validate status if provided
        if (bikeData.status && !this.isValidStatus(bikeData.status)) {
            throw new Error('Invalid status');
        }

        return this.bikeModel.update(id, bikeData);
    }

    async deleteBike(id: number): Promise<boolean> {
        // Add any business logic here (e.g., check if bike is currently rented)
        const bike = await this.bikeModel.findById(id);
        if (bike && bike.status === 'rented') {
            throw new Error('Cannot delete a rented bike');
        }

        return this.bikeModel.delete(id);
    }

    async getAvailableBikes(storeId?: number): Promise<Bike[]> {
        return this.bikeModel.findAvailable(storeId);
    }

    async getBikesByStore(storeId: number): Promise<Bike[]> {
        return this.bikeModel.findByStore(storeId);
    }

    async getBikesByType(bikeTypeId: number): Promise<Bike[]> {
        return this.bikeModel.findByBikeType(bikeTypeId);
    }

    private isValidSerialNumber(serialNumber: string): boolean {
        // Implement your serial number validation logic
        // Example: BRAND-YEAR-NUMBER (e.g., TREK-2023-001)
        const serialRegex = /^[A-Z]+-\d{4}-\d{3,}$/;
        return serialRegex.test(serialNumber);
    }

    private isValidStatus(status: string): boolean {
        const validStatuses = ['available', 'rented', 'maintenance', 'retired'];
        return validStatuses.includes(status);
    }
} 
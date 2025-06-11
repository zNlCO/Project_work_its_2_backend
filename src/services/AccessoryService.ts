import { Accessory } from '../entities/Accessory';
import { AccessoryModel } from '../models/AccessoryModel';

export class AccessoryService {
    private accessoryModel: AccessoryModel;

    constructor() {
        this.accessoryModel = new AccessoryModel();
    }

    async getAllAccessories(): Promise<Accessory[]> {
        return this.accessoryModel.findAll();
    }

    async getAccessoryById(id: number): Promise<Accessory | null> {
        return this.accessoryModel.findById(id);
    }

    async getAvailableAccessories(): Promise<Accessory[]> {
        const accessories = await this.accessoryModel.findAll();
        return accessories.filter(acc => acc.quantity > 0);
    }

    async createAccessory(accessoryData: Partial<Accessory>): Promise<Accessory> {
        // Validate required fields
        if (!accessoryData.name || !accessoryData.price || accessoryData.quantity === undefined) {
            throw new Error('Missing required fields: name, price, or quantity');
        }

        // Validate price and quantity
        if (accessoryData.price < 0) {
            throw new Error('Price cannot be negative');
        }

        if (accessoryData.quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }

        return this.accessoryModel.create(accessoryData);
    }

    async updateAccessory(id: number, accessoryData: Partial<Accessory>): Promise<Accessory | null> {
        const existingAccessory = await this.accessoryModel.findById(id);
        if (!existingAccessory) {
            throw new Error('Accessory not found');
        }

        // Validate price and quantity if provided
        if (accessoryData.price !== undefined && accessoryData.price < 0) {
            throw new Error('Price cannot be negative');
        }

        if (accessoryData.quantity !== undefined && accessoryData.quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }

        return this.accessoryModel.update(id, accessoryData);
    }

    async deleteAccessory(id: number): Promise<boolean> {
        const existingAccessory = await this.accessoryModel.findById(id);
        if (!existingAccessory) {
            throw new Error('Accessory not found');
        }

        // Check if accessory is currently in use in any active rentals
        const isInUse = await this.isAccessoryInUse(id);
        if (isInUse) {
            throw new Error('Cannot delete accessory that is currently in use');
        }

        return this.accessoryModel.delete(id);
    }

    async reserveAccessories(accessoryIds: number[], startDate: Date, endDate: Date): Promise<void> {
        for (const id of accessoryIds) {
            const accessory = await this.accessoryModel.findById(id);
            if (!accessory) {
                throw new Error(`Accessory with id ${id} not found`);
            }

            if (accessory.quantity <= 0) {
                throw new Error(`Accessory ${accessory.name} is out of stock`);
            }

            // Check if enough accessories are available for the given period
            const isAvailable = await this.checkAvailability(id, startDate, endDate);
            if (!isAvailable) {
                throw new Error(`Accessory ${accessory.name} is not available for the selected period`);
            }

            // Decrease quantity temporarily
            await this.accessoryModel.update(id, {
                quantity: accessory.quantity - 1
            });
        }
    }

    async releaseAccessories(accessoryIds: number[]): Promise<void> {
        for (const id of accessoryIds) {
            const accessory = await this.accessoryModel.findById(id);
            if (!accessory) {
                throw new Error(`Accessory with id ${id} not found`);
            }

            // Increase quantity
            await this.accessoryModel.update(id, {
                quantity: accessory.quantity + 1
            });
        }
    }

    async updateStock(id: number, quantityChange: number): Promise<Accessory | null> {
        const accessory = await this.accessoryModel.findById(id);
        if (!accessory) {
            throw new Error('Accessory not found');
        }

        const newQuantity = accessory.quantity + quantityChange;
        if (newQuantity < 0) {
            throw new Error('Cannot reduce stock below 0');
        }

        return this.accessoryModel.update(id, { quantity: newQuantity });
    }

    private async isAccessoryInUse(id: number): Promise<boolean> {
        // This should check active rentals that include this accessory
        // Implementation depends on how rentals are stored and queried
        return false; // Placeholder implementation
    }

    private async checkAvailability(id: number, startDate: Date, endDate: Date): Promise<boolean> {
        // This should check if the accessory is available for the given period
        // Implementation depends on how reservations are stored and queried
        return true; // Placeholder implementation
    }

    async searchAccessories(query: string): Promise<Accessory[]> {
        const accessories = await this.accessoryModel.findAll();
        const searchTerm = query.toLowerCase();
        
        return accessories.filter(acc => 
            acc.name.toLowerCase().includes(searchTerm) ||
            (acc.description && acc.description.toLowerCase().includes(searchTerm))
        );
    }

    async getAccessoriesByPriceRange(minPrice: number, maxPrice: number): Promise<Accessory[]> {
        const accessories = await this.accessoryModel.findAll();
        return accessories.filter(acc => 
            acc.price >= minPrice && acc.price <= maxPrice
        );
    }

    async getPopularAccessories(limit: number = 5): Promise<Accessory[]> {
        // This should return the most frequently rented accessories
        // Implementation depends on how rental history is stored
        const accessories = await this.accessoryModel.findAll();
        return accessories.slice(0, limit);
    }
} 
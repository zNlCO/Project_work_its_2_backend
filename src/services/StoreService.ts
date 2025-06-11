import { Store } from '../entities/Store';
import { StoreModel } from '../models/StoreModel';

export class StoreService {
    private storeModel: StoreModel;

    constructor() {
        this.storeModel = new StoreModel();
    }

    async getAllStores(): Promise<Store[]> {
        return this.storeModel.findAll();
    }

    async getStoreById(id: number): Promise<Store | null> {
        return this.storeModel.findById(id);
    }

    async createStore(storeData: Partial<Store>): Promise<Store> {
        // Add validation logic here
        if (!storeData.name || !storeData.address || !storeData.phone) {
            throw new Error('Missing required fields: name, address, or phone');
        }

        // Validate email format if provided
        if (storeData.email && !this.isValidEmail(storeData.email)) {
            throw new Error('Invalid email format');
        }

        // Validate phone format
        if (!this.isValidPhone(storeData.phone)) {
            throw new Error('Invalid phone format');
        }

        return this.storeModel.create(storeData);
    }

    async updateStore(id: number, storeData: Partial<Store>): Promise<Store | null> {
        // Add validation logic here
        if (storeData.email && !this.isValidEmail(storeData.email)) {
            throw new Error('Invalid email format');
        }

        if (storeData.phone && !this.isValidPhone(storeData.phone)) {
            throw new Error('Invalid phone format');
        }

        return this.storeModel.update(id, storeData);
    }

    async deleteStore(id: number): Promise<boolean> {
        // Add any business logic here (e.g., check if there are bikes in this store)
        return this.storeModel.delete(id);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        // This is a simple validation, adjust according to your needs
        const phoneRegex = /^\+?[\d\s-]{8,}$/;
        return phoneRegex.test(phone);
    }
} 
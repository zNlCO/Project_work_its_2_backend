import { Accessory } from '../entities/Accessory';
import { StoreModel } from './StoreModel';

export class AccessoryModel {
    private accessories: Accessory[] = [];
    private storeModel: StoreModel;

    constructor() {
        this.storeModel = new StoreModel();
    }

    async findAll(): Promise<Accessory[]> {
        return this.accessories;
    }

    async findById(id: number): Promise<Accessory | null> {
        return this.accessories.find(accessory => accessory.id === id) || null;
    }

    async create(accessoryData: Partial<Accessory>): Promise<Accessory> {
        // Verify that store exists
        const store = await this.storeModel.findById(accessoryData.storeId!);
        if (!store) {
            throw new Error('Store not found');
        }

        const accessory = new Accessory({
            ...accessoryData,
            id: this.accessories.length + 1,
            isAvailable: accessoryData.isAvailable ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.accessories.push(accessory);
        return accessory;
    }

    async update(id: number, accessoryData: Partial<Accessory>): Promise<Accessory | null> {
        const index = this.accessories.findIndex(accessory => accessory.id === id);
        if (index === -1) return null;

        // If store is being updated, verify it exists
        if (accessoryData.storeId) {
            const store = await this.storeModel.findById(accessoryData.storeId);
            if (!store) throw new Error('Store not found');
        }

        this.accessories[index] = new Accessory({
            ...this.accessories[index],
            ...accessoryData,
            updatedAt: new Date()
        });
        return this.accessories[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.accessories.findIndex(accessory => accessory.id === id);
        if (index === -1) return false;
        
        this.accessories.splice(index, 1);
        return true;
    }

    async findByStore(storeId: number): Promise<Accessory[]> {
        return this.accessories.filter(accessory => accessory.storeId === storeId);
    }

    async findAvailable(storeId?: number): Promise<Accessory[]> {
        return this.accessories.filter(accessory => 
            accessory.isAvailable && 
            accessory.quantity > 0 &&
            (!storeId || accessory.storeId === storeId)
        );
    }
} 
import { Store } from '../entities/Store';

export class StoreModel {
    private stores: Store[] = [];

    async findAll(): Promise<Store[]> {
        return this.stores;
    }

    async findById(id: number): Promise<Store | null> {
        return this.stores.find(store => store.id === id) || null;
    }

    async create(storeData: Partial<Store>): Promise<Store> {
        const store = new Store({
            ...storeData,
            id: this.stores.length + 1,
            isActive: storeData.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        this.stores.push(store);
        return store;
    }

    async update(id: number, storeData: Partial<Store>): Promise<Store | null> {
        const index = this.stores.findIndex(store => store.id === id);
        if (index === -1) return null;

        this.stores[index] = new Store({
            ...this.stores[index],
            ...storeData,
            updatedAt: new Date()
        });
        return this.stores[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.stores.findIndex(store => store.id === id);
        if (index === -1) return false;
        
        this.stores.splice(index, 1);
        return true;
    }
} 
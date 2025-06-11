import { Bike } from '../entities/Bike';
import { BikeTypeModel } from './BikeTypeModel';
import { StoreModel } from './StoreModel';

export class BikeModel {
    private bikes: Bike[] = [];
    private bikeTypeModel: BikeTypeModel;
    private storeModel: StoreModel;

    constructor() {
        this.bikeTypeModel = new BikeTypeModel();
        this.storeModel = new StoreModel();
    }

    async findAll(): Promise<Bike[]> {
        return this.bikes;
    }

    async findById(id: number): Promise<Bike | null> {
        const bike = this.bikes.find(bike => bike.id === id);
        if (!bike) return null;

        // Load related entities
        bike.bikeType = await this.bikeTypeModel.findById(bike.bikeTypeId);
        bike.store = await this.storeModel.findById(bike.storeId);
        
        return bike;
    }

    async create(bikeData: Partial<Bike>): Promise<Bike> {
        // Verify that bikeType and store exist
        const bikeType = await this.bikeTypeModel.findById(bikeData.bikeTypeId!);
        const store = await this.storeModel.findById(bikeData.storeId!);

        if (!bikeType || !store) {
            throw new Error('BikeType or Store not found');
        }

        const bike = new Bike({
            ...bikeData,
            id: this.bikes.length + 1,
            status: bikeData.status || 'available',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.bikes.push(bike);
        return bike;
    }

    async update(id: number, bikeData: Partial<Bike>): Promise<Bike | null> {
        const index = this.bikes.findIndex(bike => bike.id === id);
        if (index === -1) return null;

        // If store or bikeType is being updated, verify they exist
        if (bikeData.storeId) {
            const store = await this.storeModel.findById(bikeData.storeId);
            if (!store) throw new Error('Store not found');
        }

        if (bikeData.bikeTypeId) {
            const bikeType = await this.bikeTypeModel.findById(bikeData.bikeTypeId);
            if (!bikeType) throw new Error('BikeType not found');
        }

        this.bikes[index] = new Bike({
            ...this.bikes[index],
            ...bikeData,
            updatedAt: new Date()
        });

        return this.findById(id);  // Return with populated relations
    }

    async delete(id: number): Promise<boolean> {
        const index = this.bikes.findIndex(bike => bike.id === id);
        if (index === -1) return false;
        
        this.bikes.splice(index, 1);
        return true;
    }

    async findByStore(storeId: number): Promise<Bike[]> {
        return this.bikes.filter(bike => bike.storeId === storeId);
    }

    async findByBikeType(bikeTypeId: number): Promise<Bike[]> {
        return this.bikes.filter(bike => bike.bikeTypeId === bikeTypeId);
    }

    async findAvailable(storeId?: number): Promise<Bike[]> {
        return this.bikes.filter(bike => 
            bike.status === 'available' && 
            (!storeId || bike.storeId === storeId)
        );
    }
} 
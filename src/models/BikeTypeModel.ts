import { BikeType } from '../entities/BikeType';

export class BikeTypeModel {
    private bikeTypes: BikeType[] = [];

    async findAll(): Promise<BikeType[]> {
        return this.bikeTypes;
    }

    async findById(id: number): Promise<BikeType | null> {
        return this.bikeTypes.find(bikeType => bikeType.id === id) || null;
    }

    async create(bikeTypeData: Partial<BikeType>): Promise<BikeType> {
        const bikeType = new BikeType({
            ...bikeTypeData,
            id: this.bikeTypes.length + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        this.bikeTypes.push(bikeType);
        return bikeType;
    }

    async update(id: number, bikeTypeData: Partial<BikeType>): Promise<BikeType | null> {
        const index = this.bikeTypes.findIndex(bikeType => bikeType.id === id);
        if (index === -1) return null;

        this.bikeTypes[index] = new BikeType({
            ...this.bikeTypes[index],
            ...bikeTypeData,
            updatedAt: new Date()
        });
        return this.bikeTypes[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.bikeTypes.findIndex(bikeType => bikeType.id === id);
        if (index === -1) return false;
        
        this.bikeTypes.splice(index, 1);
        return true;
    }
} 
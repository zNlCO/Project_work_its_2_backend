import { BikeType } from '../entities/BikeType';
import { BikeTypeModel } from '../models/BikeTypeModel';

export class BikeTypeService {
    private bikeTypeModel: BikeTypeModel;

    constructor() {
        this.bikeTypeModel = new BikeTypeModel();
    }

    async getAllBikeTypes(): Promise<BikeType[]> {
        return this.bikeTypeModel.findAll();
    }

    async getBikeTypeById(id: number): Promise<BikeType | null> {
        return this.bikeTypeModel.findById(id);
    }

    async createBikeType(bikeTypeData: Partial<BikeType>): Promise<BikeType> {
        // Add validation logic here
        if (!bikeTypeData.model || !bikeTypeData.brand || !bikeTypeData.hourlyPrice) {
            throw new Error('Missing required fields: model, brand, or hourlyPrice');
        }

        if (bikeTypeData.hourlyPrice <= 0) {
            throw new Error('Hourly price must be greater than 0');
        }

        return this.bikeTypeModel.create(bikeTypeData);
    }

    async updateBikeType(id: number, bikeTypeData: Partial<BikeType>): Promise<BikeType | null> {
        // Add validation logic here
        if (bikeTypeData.hourlyPrice !== undefined && bikeTypeData.hourlyPrice <= 0) {
            throw new Error('Hourly price must be greater than 0');
        }

        return this.bikeTypeModel.update(id, bikeTypeData);
    }

    async deleteBikeType(id: number): Promise<boolean> {
        // Add any business logic here (e.g., check if there are bikes of this type)
        return this.bikeTypeModel.delete(id);
    }
} 
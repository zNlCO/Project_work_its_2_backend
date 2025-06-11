import { Insurance } from '../entities/Insurance';
import { InsuranceModel } from '../models/InsuranceModel';

export class InsuranceService {
    private insuranceModel: InsuranceModel;

    constructor() {
        this.insuranceModel = new InsuranceModel();
    }

    async getAllInsurances(): Promise<Insurance[]> {
        return this.insuranceModel.findAll();
    }

    async getInsuranceById(id: number): Promise<Insurance | null> {
        return this.insuranceModel.findById(id);
    }

    async createInsurance(insuranceData: Partial<Insurance>): Promise<Insurance> {
        // Validate required fields
        if (!insuranceData.name || !insuranceData.coverage || !insuranceData.price) {
            throw new Error('Missing required fields: name, coverage, or price');
        }

        // Validate price
        if (insuranceData.price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        // Validate coverage object
        if (!this.isValidCoverage(insuranceData.coverage)) {
            throw new Error('Invalid coverage object structure');
        }

        return this.insuranceModel.create(insuranceData);
    }

    async updateInsurance(id: number, insuranceData: Partial<Insurance>): Promise<Insurance | null> {
        // Validate price if provided
        if (insuranceData.price !== undefined && insuranceData.price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        // Validate coverage if provided
        if (insuranceData.coverage && !this.isValidCoverage(insuranceData.coverage)) {
            throw new Error('Invalid coverage object structure');
        }

        return this.insuranceModel.update(id, insuranceData);
    }

    async deleteInsurance(id: number): Promise<boolean> {
        return this.insuranceModel.delete(id);
    }

    private isValidCoverage(coverage: any): boolean {
        if (typeof coverage !== 'object' || coverage === null) {
            return false;
        }

        const requiredFields = ['theft', 'damage', 'thirdPartyLiability'];
        return requiredFields.every(field => 
            typeof coverage[field] === 'boolean'
        );
    }
} 
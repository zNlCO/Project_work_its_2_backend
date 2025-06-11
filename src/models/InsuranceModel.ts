import { Insurance } from '../entities/Insurance';

export class InsuranceModel {
    private insurances: Insurance[] = [];

    async findAll(): Promise<Insurance[]> {
        return this.insurances;
    }

    async findById(id: number): Promise<Insurance | null> {
        return this.insurances.find(insurance => insurance.id === id) || null;
    }

    async create(insuranceData: Partial<Insurance>): Promise<Insurance> {
        const insurance = new Insurance({
            ...insuranceData,
            id: this.insurances.length + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        this.insurances.push(insurance);
        return insurance;
    }

    async update(id: number, insuranceData: Partial<Insurance>): Promise<Insurance | null> {
        const index = this.insurances.findIndex(insurance => insurance.id === id);
        if (index === -1) return null;

        this.insurances[index] = new Insurance({
            ...this.insurances[index],
            ...insuranceData,
            updatedAt: new Date()
        });
        return this.insurances[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.insurances.findIndex(insurance => insurance.id === id);
        if (index === -1) return false;
        
        this.insurances.splice(index, 1);
        return true;
    }
} 
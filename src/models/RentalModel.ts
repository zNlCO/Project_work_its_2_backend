import { Rental } from '../entities/Rental';
import { UserModel } from './UserModel';
import { BikeModel } from './BikeModel';
import { InsuranceModel } from './InsuranceModel';
import { AccessoryModel } from './AccessoryModel';

export class RentalModel {
    private rentals: Rental[] = [];
    private userModel: UserModel;
    private bikeModel: BikeModel;
    private insuranceModel: InsuranceModel;
    private accessoryModel: AccessoryModel;

    constructor() {
        this.userModel = new UserModel();
        this.bikeModel = new BikeModel();
        this.insuranceModel = new InsuranceModel();
        this.accessoryModel = new AccessoryModel();
    }

    async findAll(): Promise<Rental[]> {
        return this.rentals;
    }

    async findById(id: number): Promise<Rental | null> {
        const rental = this.rentals.find(rental => rental.id === id);
        if (!rental) return null;

        // Load related entities
        const user = await this.userModel.findById(rental.userId);
        if (user) rental.user = user;

        const bike = await this.bikeModel.findById(rental.bikeId);
        if (bike) rental.bike = bike;

        if (rental.insuranceId) {
            const insurance = await this.insuranceModel.findById(rental.insuranceId);
            if (insurance) rental.insurance = insurance;
        }

        return rental;
    }

    async findByUser(userId: number): Promise<Rental[]> {
        return this.rentals.filter(rental => rental.userId === userId);
    }

    async findByBike(bikeId: number): Promise<Rental[]> {
        return this.rentals.filter(rental => rental.bikeId === bikeId);
    }

    async findActive(): Promise<Rental[]> {
        return this.rentals.filter(rental => rental.status === 'active');
    }

    async create(rentalData: Partial<Rental>): Promise<Rental> {
        const rental = new Rental({
            ...rentalData,
            id: this.rentals.length + 1,
            status: rentalData.status || 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.rentals.push(rental);
        return rental;
    }

    async update(id: number, rentalData: Partial<Rental>): Promise<Rental | null> {
        const index = this.rentals.findIndex(rental => rental.id === id);
        if (index === -1) return null;

        this.rentals[index] = new Rental({
            ...this.rentals[index],
            ...rentalData,
            updatedAt: new Date()
        });

        return this.findById(id);  // Return with populated relations
    }

    async delete(id: number): Promise<boolean> {
        const index = this.rentals.findIndex(rental => rental.id === id);
        if (index === -1) return false;
        
        this.rentals.splice(index, 1);
        return true;
    }

    async calculateRentalCost(rental: Rental): Promise<number> {
        let totalCost = 0;
        
        // Get bike hourly rate
        const bike = await this.bikeModel.findById(rental.bikeId);
        if (!bike || !bike.bikeType) throw new Error('Bike or bike type not found');
        
        // Calculate duration in hours
        const duration = Math.ceil(
            (rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60)
        );
        
        // Base cost
        totalCost += bike.bikeType.hourlyPrice * duration;
        
        // Add insurance cost if any
        if (rental.insuranceId) {
            const insurance = await this.insuranceModel.findById(rental.insuranceId);
            if (insurance) {
                totalCost += insurance.price * Math.ceil(duration / 24); // Insurance is per day
            }
        }
        
        // Add accessories cost
        if (rental.accessories && rental.accessories.length > 0) {
            for (const accessory of rental.accessories) {
                totalCost += accessory.price * Math.ceil(duration / 24); // Accessories are per day
            }
        }
        
        return totalCost;
    }
} 
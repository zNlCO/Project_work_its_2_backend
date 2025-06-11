import { Rental } from '../entities/Rental';
import { RentalModel } from '../models/RentalModel';
import { BikeModel } from '../models/BikeModel';
import { UserModel } from '../models/UserModel';
import { InsuranceModel } from '../models/InsuranceModel';

export class RentalService {
    private rentalModel: RentalModel;
    private bikeModel: BikeModel;
    private userModel: UserModel;
    private insuranceModel: InsuranceModel;

    constructor() {
        this.rentalModel = new RentalModel();
        this.bikeModel = new BikeModel();
        this.userModel = new UserModel();
        this.insuranceModel = new InsuranceModel();
    }

    async getAllRentals(): Promise<Rental[]> {
        return this.rentalModel.findAll();
    }

    async getRentalById(id: number): Promise<Rental | null> {
        return this.rentalModel.findById(id);
    }

    async getRentalsByUser(userId: number): Promise<Rental[]> {
        return this.rentalModel.findByUser(userId);
    }

    async getActiveRentals(): Promise<Rental[]> {
        return this.rentalModel.findActive();
    }

    async createRental(rentalData: Partial<Rental>): Promise<Rental> {
        // Validate required fields
        if (!rentalData.userId || !rentalData.bikeId || !rentalData.startDate || !rentalData.endDate) {
            throw new Error('Missing required fields: userId, bikeId, startDate, or endDate');
        }

        // Validate dates
        const startDate = new Date(rentalData.startDate);
        const endDate = new Date(rentalData.endDate);
        const now = new Date();

        if (startDate < now) {
            throw new Error('Start date cannot be in the past');
        }

        if (endDate <= startDate) {
            throw new Error('End date must be after start date');
        }

        // Verify that user exists and is active
        const user = await this.userModel.findById(rentalData.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify that bike exists and is available
        const bike = await this.bikeModel.findById(rentalData.bikeId);
        if (!bike) {
            throw new Error('Bike not found');
        }

        if (bike.status !== 'available') {
            throw new Error('Bike is not available for rental');
        }

        // Verify insurance if provided
        if (rentalData.insuranceId) {
            const insurance = await this.insuranceModel.findById(rentalData.insuranceId);
            if (!insurance) {
                throw new Error('Insurance not found');
            }
        }

        // Calculate rental cost
        const rental = new Rental({
            ...rentalData,
            status: 'pending',
            startDate,
            endDate
        });

        const totalCost = await this.rentalModel.calculateRentalCost(rental);
        rental.totalCost = totalCost;
        rental.deposit = totalCost * 0.2; // 20% deposit

        // Create the rental
        const createdRental = await this.rentalModel.create(rental);

        // Update bike status
        await this.bikeModel.update(bike.id, { status: 'rented' });

        return createdRental;
    }

    async updateRental(id: number, rentalData: Partial<Rental>): Promise<Rental | null> {
        const existingRental = await this.rentalModel.findById(id);
        if (!existingRental) {
            throw new Error('Rental not found');
        }

        // Validate status transitions
        if (rentalData.status) {
            if (!this.isValidStatusTransition(existingRental.status, rentalData.status)) {
                throw new Error(`Invalid status transition from ${existingRental.status} to ${rentalData.status}`);
            }

            // Handle bike status based on rental status
            if (rentalData.status === 'completed' || rentalData.status === 'cancelled') {
                await this.bikeModel.update(existingRental.bikeId, { status: 'available' });
            }
        }

        // Update rental
        return this.rentalModel.update(id, rentalData);
    }

    async cancelRental(id: number): Promise<Rental | null> {
        const rental = await this.rentalModel.findById(id);
        if (!rental) {
            throw new Error('Rental not found');
        }

        if (rental.status !== 'pending') {
            throw new Error('Only pending rentals can be cancelled');
        }

        // Update bike status
        await this.bikeModel.update(rental.bikeId, { status: 'available' });

        // Update rental
        return this.rentalModel.update(id, { 
            status: 'cancelled',
            notes: rental.notes ? `${rental.notes}\nCancelled by user` : 'Cancelled by user'
        });
    }

    async completeRental(id: number): Promise<Rental | null> {
        const rental = await this.rentalModel.findById(id);
        if (!rental) {
            throw new Error('Rental not found');
        }

        if (rental.status !== 'active') {
            throw new Error('Only active rentals can be completed');
        }

        // Update bike status
        await this.bikeModel.update(rental.bikeId, { status: 'available' });

        // Update rental
        return this.rentalModel.update(id, {
            status: 'completed',
            actualReturnDate: new Date()
        });
    }

    private isValidStatusTransition(from: string, to: string): boolean {
        const validTransitions: { [key: string]: string[] } = {
            'pending': ['active', 'cancelled'],
            'active': ['completed'],
            'completed': [],
            'cancelled': []
        };

        return validTransitions[from]?.includes(to) || false;
    }
} 
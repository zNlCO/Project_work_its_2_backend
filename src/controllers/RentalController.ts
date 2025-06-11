import { Request, Response } from 'express';
import { RentalService } from '../services/RentalService';

export class RentalController {
    private rentalService: RentalService;

    constructor() {
        this.rentalService = new RentalService();
    }

    async getAllRentals(req: Request, res: Response): Promise<void> {
        try {
            const rentals = await this.rentalService.getAllRentals();
            res.json(rentals);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch rentals' });
        }
    }

    async getRentalById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const rental = await this.rentalService.getRentalById(id);
            
            if (!rental) {
                res.status(404).json({ error: 'Rental not found' });
                return;
            }

            res.json(rental);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch rental' });
        }
    }

    async getRentalsByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            const rentals = await this.rentalService.getRentalsByUser(userId);
            res.json(rentals);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user rentals' });
        }
    }

    async getActiveRentals(req: Request, res: Response): Promise<void> {
        try {
            const rentals = await this.rentalService.getActiveRentals();
            res.json(rentals);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch active rentals' });
        }
    }

    async createRental(req: Request, res: Response): Promise<void> {
        try {
            const rental = await this.rentalService.createRental(req.body);
            res.status(201).json(rental);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to create rental' });
            }
        }
    }

    async updateRental(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const rental = await this.rentalService.updateRental(id, req.body);
            
            if (!rental) {
                res.status(404).json({ error: 'Rental not found' });
                return;
            }

            res.json(rental);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to update rental' });
            }
        }
    }

    async cancelRental(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const rental = await this.rentalService.cancelRental(id);
            
            if (!rental) {
                res.status(404).json({ error: 'Rental not found' });
                return;
            }

            res.json(rental);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to cancel rental' });
            }
        }
    }

    async completeRental(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const rental = await this.rentalService.completeRental(id);
            
            if (!rental) {
                res.status(404).json({ error: 'Rental not found' });
                return;
            }

            res.json(rental);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to complete rental' });
            }
        }
    }
} 
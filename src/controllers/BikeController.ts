import { Request, Response } from 'express';
import { BikeService } from '../services/BikeService';

export class BikeController {
    private bikeService: BikeService;

    constructor() {
        this.bikeService = new BikeService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const bikes = await this.bikeService.getAllBikes();
            res.json(bikes);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const bike = await this.bikeService.getBikeById(id);
            
            if (!bike) {
                res.status(404).json({ error: 'Bike not found' });
                return;
            }
            
            res.json(bike);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const bike = await this.bikeService.createBike(req.body);
            res.status(201).json(bike);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const bike = await this.bikeService.updateBike(id, req.body);
            
            if (!bike) {
                res.status(404).json({ error: 'Bike not found' });
                return;
            }
            
            res.json(bike);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.bikeService.deleteBike(id);
            
            if (!deleted) {
                res.status(404).json({ error: 'Bike not found' });
                return;
            }
            
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAvailable(req: Request, res: Response): Promise<void> {
        try {
            const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : undefined;
            const bikes = await this.bikeService.getAvailableBikes(storeId);
            res.json(bikes);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getByStore(req: Request, res: Response): Promise<void> {
        try {
            const storeId = parseInt(req.params.storeId);
            const bikes = await this.bikeService.getBikesByStore(storeId);
            res.json(bikes);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getByType(req: Request, res: Response): Promise<void> {
        try {
            const bikeTypeId = parseInt(req.params.bikeTypeId);
            const bikes = await this.bikeService.getBikesByType(bikeTypeId);
            res.json(bikes);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
} 
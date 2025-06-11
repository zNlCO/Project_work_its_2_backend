import { Request, Response } from 'express';
import { BikeTypeService } from '../services/BikeTypeService';

export class BikeTypeController {
    private bikeTypeService: BikeTypeService;

    constructor() {
        this.bikeTypeService = new BikeTypeService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const bikeTypes = await this.bikeTypeService.getAllBikeTypes();
            res.json(bikeTypes);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const bikeType = await this.bikeTypeService.getBikeTypeById(id);
            
            if (!bikeType) {
                res.status(404).json({ error: 'BikeType not found' });
                return;
            }
            
            res.json(bikeType);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const bikeType = await this.bikeTypeService.createBikeType(req.body);
            res.status(201).json(bikeType);
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
            const bikeType = await this.bikeTypeService.updateBikeType(id, req.body);
            
            if (!bikeType) {
                res.status(404).json({ error: 'BikeType not found' });
                return;
            }
            
            res.json(bikeType);
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
            const deleted = await this.bikeTypeService.deleteBikeType(id);
            
            if (!deleted) {
                res.status(404).json({ error: 'BikeType not found' });
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
} 
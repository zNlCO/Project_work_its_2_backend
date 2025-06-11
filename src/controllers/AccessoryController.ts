import { Request, Response } from 'express';
import { AccessoryService } from '../services/AccessoryService';

export class AccessoryController {
    private accessoryService: AccessoryService;

    constructor() {
        this.accessoryService = new AccessoryService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const accessories = await this.accessoryService.getAllAccessories();
            res.json(accessories);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const accessory = await this.accessoryService.getAccessoryById(id);
            
            if (!accessory) {
                res.status(404).json({ error: 'Accessory not found' });
                return;
            }
            
            res.json(accessory);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const accessory = await this.accessoryService.createAccessory(req.body);
            res.status(201).json(accessory);
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
            const accessory = await this.accessoryService.updateAccessory(id, req.body);
            
            if (!accessory) {
                res.status(404).json({ error: 'Accessory not found' });
                return;
            }
            
            res.json(accessory);
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
            const deleted = await this.accessoryService.deleteAccessory(id);
            
            if (!deleted) {
                res.status(404).json({ error: 'Accessory not found' });
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

    async getByStore(req: Request, res: Response): Promise<void> {
        try {
            const storeId = parseInt(req.params.storeId);
            const accessories = await this.accessoryService.getAccessoriesByStore(storeId);
            res.json(accessories);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAvailable(req: Request, res: Response): Promise<void> {
        try {
            const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : undefined;
            const accessories = await this.accessoryService.getAvailableAccessories(storeId);
            res.json(accessories);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateStock(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { quantity } = req.body;

            if (typeof quantity !== 'number') {
                res.status(400).json({ error: 'Quantity must be a number' });
                return;
            }

            const accessory = await this.accessoryService.updateStock(id, quantity);
            
            if (!accessory) {
                res.status(404).json({ error: 'Accessory not found' });
                return;
            }
            
            res.json(accessory);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
} 
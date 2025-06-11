import { Request, Response } from 'express';
import { StoreService } from '../services/StoreService';

export class StoreController {
    private storeService: StoreService;

    constructor() {
        this.storeService = new StoreService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const stores = await this.storeService.getAllStores();
            res.json(stores);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const store = await this.storeService.getStoreById(id);
            
            if (!store) {
                res.status(404).json({ error: 'Store not found' });
                return;
            }
            
            res.json(store);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const store = await this.storeService.createStore(req.body);
            res.status(201).json(store);
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
            const store = await this.storeService.updateStore(id, req.body);
            
            if (!store) {
                res.status(404).json({ error: 'Store not found' });
                return;
            }
            
            res.json(store);
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
            const deleted = await this.storeService.deleteStore(id);
            
            if (!deleted) {
                res.status(404).json({ error: 'Store not found' });
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
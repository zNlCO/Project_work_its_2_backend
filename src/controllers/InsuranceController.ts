import { Request, Response } from 'express';
import { InsuranceService } from '../services/InsuranceService';

export class InsuranceController {
    private insuranceService: InsuranceService;

    constructor() {
        this.insuranceService = new InsuranceService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const insurances = await this.insuranceService.getAllInsurances();
            res.json(insurances);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const insurance = await this.insuranceService.getInsuranceById(id);
            
            if (!insurance) {
                res.status(404).json({ error: 'Insurance not found' });
                return;
            }
            
            res.json(insurance);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const insurance = await this.insuranceService.createInsurance(req.body);
            res.status(201).json(insurance);
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
            const insurance = await this.insuranceService.updateInsurance(id, req.body);
            
            if (!insurance) {
                res.status(404).json({ error: 'Insurance not found' });
                return;
            }
            
            res.json(insurance);
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
            const deleted = await this.insuranceService.deleteInsurance(id);
            
            if (!deleted) {
                res.status(404).json({ error: 'Insurance not found' });
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
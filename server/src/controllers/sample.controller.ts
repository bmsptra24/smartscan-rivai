import { Request, Response, Router } from 'express';
import { sampleService } from '../services';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await sampleService.getSampleData();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

export { router as sampleController };
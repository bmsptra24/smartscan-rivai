import { Router } from 'express';
import { cloudinaryService } from '../services';

const router = Router();

router.delete('/', async (req: any, res: any) => {
    try {
        // Extract public_id from query parameters
        const { public_id } = req.query;

        // Validate public_id
        if (!public_id || typeof public_id !== 'string') {
            return res.status(400).type('text/plain').send('Missing or invalid public_id parameter');
        }

        // Call CloudinaryService to delete the file
        await cloudinaryService.deleteFile(public_id);

        // Return success response
        res.status(200).json({ message: `Resource with public_id ${public_id} deleted successfully` });
    } catch (error: unknown) {
        console.error('API route error:', error);

        // Handle specific errors
        if (error instanceof Error && error.message.includes('not found')) {
            return res.status(404).type('text/plain').send('Resource with public_id not found');
        }

        // Generic error response
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to delete resource', error: errorMessage });
    }
});

export { router as cloudinaryController };
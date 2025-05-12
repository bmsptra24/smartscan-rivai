import { Router } from 'express';
import { sampleController } from './sample.controller';
import { cloudinaryController } from './cloudinary.controller';

const router = Router();

// http://localhost:3000/api/sample
router.use('/sample', sampleController);
router.use('/cloudinary', cloudinaryController);

export { router as controllers };
import express from 'express';
import {body} from 'express-validator';
import {validate} from '../../middlewares';
import { createImage } from '../controllers/imageController';


const router = express.Router();

router.route('/').post(body('text').notEmpty().escape(), validate, createImage);

export default router;

import express from 'express';
const router = express.Router();

import formsController from '../app/controller/FormsController.js';

router.use('/', formsController.index);

export default router;
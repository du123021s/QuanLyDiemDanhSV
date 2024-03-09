import express from 'express';
import dashboardController from '../app/controller/DashboardController.js';
const router = express.Router();

router.get('/', dashboardController.show);

export default router;
import express from 'express';
import StatisticalController from '../app/controller/StatisticalController.js';

const router = express.Router();

router.get('/', StatisticalController.show);
router.get('/details', StatisticalController.absentMoreThanNumber);
router.get('/percentage25', StatisticalController.absentMoreThanPer25);


// router.get('/user', SiteController.user );
export default router;
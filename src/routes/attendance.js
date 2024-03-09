import express from "express";
import attendanceController from '../app/controller/AttendanceController.js';
const router = express.Router();

router.get('/:documentId', attendanceController.show);
router.post('/:documentId', attendanceController.update);


export default router;
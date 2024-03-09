import express from 'express';
import adminController from '../app/controller/AdminController.js';
const router = express.Router();
import { adminAccess } from '../util/permission.js';

router.get('/', adminAccess, adminController.showUsers);

router.post('/create', adminAccess, adminController.createUsers);
router.delete('/', adminAccess, adminController.deleteUsers);
router.put('/update', adminAccess, adminController.getInforUser);
router.post('/update', adminAccess, adminController.updateUser);
export default router;
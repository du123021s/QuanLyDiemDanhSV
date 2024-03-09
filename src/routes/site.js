import express from 'express';
import siteController from '../app/controller/SiteController.js';

const router = express.Router();

router.get('/login', siteController.login);
router.post('/login', siteController.checkLogin);

router.get('/logout', siteController.logout);



// router.get('/user', SiteController.user );
export default router;
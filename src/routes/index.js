import siteRoute from './site.js';
import attendanceRoute from './attendance.js';
import fileRoute from './file.js';
import dashboardRoute from './dashboard.js';
import exportRoute from './export.js';
import adminRoute from './admin.js';
import statisticalRoute from './statistical.js';
import express from 'express';
import paginate from 'express-paginate';
import siteController from '../app/controller/SiteController.js';

const route = (app) => {

      app.use(express.urlencoded({ extended: true }));  // data is html
      app.use(express.json());  // data is js

      app.use('/', siteRoute);
      app.use('/importFile', siteController.requireAuth, fileRoute);
      app.use('/dashboard', siteController.requireAuth, dashboardRoute);
      app.use('/attendance', siteController.requireAuth, attendanceRoute);
      app.use('/exportFile', siteController.requireAuth, exportRoute);
      app.use('/statistical', siteController.requireAuth, statisticalRoute);

      // --- Admin ---
      app.use('/manage-users', adminRoute);

      // Kích hoạt express-paginate
      app.use(paginate.middleware(10, 50)); // Số lượng mục trên mỗi trang và giới hạn tối đa

}


export default route;
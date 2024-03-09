import express from "express";
import fileController from "../app/controller/FileController.js";
import siteController from "../app/controller/SiteController.js";
const router = express.Router();
import multer from "multer";


// === storage location when uploading files
var storage = multer.diskStorage({
  destination: (req, importFile, cb) => {
    cb(null, './src/public/uploads');
  },
  filename: (req, importFile, cb) => {
    cb(null, importFile.originalname)
  }
});

var upload = multer({ storage: storage });

router.get('/', fileController.show);
router.post('/', upload.single('importFile'), fileController.handleImportFile);
router.delete('/', fileController.handleDeletedFile);

router.get('/all-users', siteController.getAllUsers);
router.post('/assign-permission', siteController.assignFilePermission);


export default router;
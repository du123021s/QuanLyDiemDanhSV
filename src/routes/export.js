import express from "express";
import fileController from "../app/controller/FileController.js";
const router = express.Router();


router.post('/', fileController.handleExportFile);

export default router;
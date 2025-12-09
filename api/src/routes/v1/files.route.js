import express from 'express';
import {
  createFile,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile
} from '../../controllers/Files.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';
import { uploadMultipleImages } from '../../middlewares/upload.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(uploadMultipleImages('files[]', 10), createFile)
  .get(getAllFiles);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getFileById)
  .put(updateFile)
  .delete(deleteFile);

export default router;

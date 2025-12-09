import express from 'express';
import {
  createExamination,
  getAllExaminations,
  getExaminationById,
  updateExamination,
  deleteExamination
} from '../../controllers/Examinations.controller.js';
import validateToken from '../../middlewares/validate-token.js'
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())  // authorize('Examinations')
  .post(createExamination)
  .get(getAllExaminations);

router.route('/:id')
  .all(validateToken, authorize('Examinations'))
  .get(getExaminationById)
  .put(updateExamination)
  .delete(deleteExamination);

export default router;

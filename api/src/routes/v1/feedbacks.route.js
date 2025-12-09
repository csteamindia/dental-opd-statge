import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} from '../../controllers/Feedbacks.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createFeedback)
  .get(getAllFeedbacks);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getFeedbackById)
  .put(updateFeedback)
  .delete(deleteFeedback);

export default router;

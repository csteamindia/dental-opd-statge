import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  createGenralFeedback,
  getAllGenralFeedbacks
} from '../../controllers/Feedbacks.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();
router.route('/genaral')
  .post(createGenralFeedback)
  .get(getAllGenralFeedbacks);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getFeedbackById)
  .put(updateFeedback)
  .delete(deleteFeedback);

router.route('/')
  .all(validateToken, authorize())
  .post(createFeedback)
  .get(getAllFeedbacks);


export default router;

import express from "express";
import {
  createFeedbackQuestion,
  getAllFeedbackQuestions,
  getFeedbackQuestionById,
  updateFeedbackQuestion,
  deleteFeedbackQuestion,
} from "../../controllers/FeedbackQuations.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize())
  .get(getAllFeedbackQuestions)
  .post(createFeedbackQuestion);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getFeedbackQuestionById)
  .put(updateFeedbackQuestion)
  .delete(deleteFeedbackQuestion);

export default router;

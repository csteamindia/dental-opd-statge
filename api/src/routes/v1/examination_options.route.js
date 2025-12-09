import express from "express";
import {
  createExamination_Options,
  getAllExamination_Options,
} from "../../controllers/Examination_Options.Controller.js";
import validateToken from "../../middlewares/validate-token.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken)
  .post(createExamination_Options)
  .get(getAllExamination_Options);

export default router;

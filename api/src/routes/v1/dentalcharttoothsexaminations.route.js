import express from "express";
import {
  createDentalChartToothsExamination,
  getAllDentalChartToothsExamination,
  getDentalChartToothsExaminationById,
  updateDentalChartToothsExamination,
  deleteDentalChartToothsExamination,
  getAllDentalChartToothsExaminationOptions
} from "../../controllers/DentalChartToothsExamination.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/options")
  .all(validateToken, authorize())
  .get(getAllDentalChartToothsExaminationOptions);

router
  .route("/")
  .all(validateToken, authorize())
  .post(createDentalChartToothsExamination)
  .get(getAllDentalChartToothsExamination);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getDentalChartToothsExaminationById)
  .put(updateDentalChartToothsExamination)
  .delete(deleteDentalChartToothsExamination);

export default router;
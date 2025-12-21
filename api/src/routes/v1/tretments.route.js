import express from "express";
import {
  createTreatment,
  getAllTreatments,
  addTreatmentType,
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
  getAllTreatmentTypes,
  updateTreatmentType,
  deleteTreatmentType,
  addTreatmentStatus
} from "../../controllers/Tretments.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize())
  .post(createTreatment)
  .get(getAllTreatments);

router
  .route("/type")
  .all(validateToken, authorize())
  .post(addTreatmentType)
  .get(getAllTreatmentTypes)

router
  .route("/updatestatus/:id")
  .all(validateToken, authorize())
  .get(addTreatmentStatus);

  router
  .route("/type/:id")
  .all(validateToken, authorize())
  .put(updateTreatmentType)
  .delete(deleteTreatmentType);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getTreatmentById)
  .put(updateTreatment)
  .delete(deleteTreatment);

export default router;

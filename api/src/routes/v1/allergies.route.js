import express from "express";
import {
  createAllergy,
  getAllAllergies,
  getAllergyById,
  updateAllergy,
  deleteAllergy,
} from "../../controllers/Allergies.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize()) // authorize('allergies')
  .post(createAllergy)
  .get(getAllAllergies);

router
  .route("/:id")
  .all(validateToken, authorize("allergies"))
  .get(getAllergyById)
  .put(updateAllergy)
  .delete(deleteAllergy);

export default router;

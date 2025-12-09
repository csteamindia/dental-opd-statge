import express from "express";
import {
  createPatient_Follow_Up,
  getAllPatient_Follow_Up,
  getPatient_Follow_UpById,
  deletePatient_Follow_Up,
} from "../../controllers/Patient_Follow_Up.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize())
  .post(createPatient_Follow_Up)
  .get(getAllPatient_Follow_Up);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getPatient_Follow_UpById)
  .delete(deletePatient_Follow_Up);

export default router;

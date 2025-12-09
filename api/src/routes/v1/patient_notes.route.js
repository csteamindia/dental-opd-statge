import express from "express";
import {
  createPatient_Notes,
  getAllPatient_Notes,
  getPatient_NotesById,
  deletePatient_Notes,
} from "../../controllers/Patient_Notes.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize())
  .post(createPatient_Notes)
  .get(getAllPatient_Notes);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getPatient_NotesById)
  .delete(deletePatient_Notes);

export default router;

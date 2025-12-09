import express from "express";
import {
  createRX_Templates,
  getAllRX_Templates,
  getRX_TemplatesById,
  updateRX_Templates,
  deleteRX_Templates,
} from "../../controllers/RX_TemplatesController.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize())
  .post(createRX_Templates)
  .get(getAllRX_Templates);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getRX_TemplatesById)
  .put(updateRX_Templates)
  .delete(deleteRX_Templates);

export default router;

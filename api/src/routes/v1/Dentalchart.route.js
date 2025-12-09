import express from "express";
import {
  createDental_Chart_Examinations,
  getAllDental_Chart_Examinations,
  getDental_Chart_ExaminationsById,
  updateDental_Chart_Examinations,
  deleteDental_Chart_Examinations,
  createPeriodicalChart,
  getPeriodicalChart,
  updatePeriodicalChart,
  deletePeriodicalChart,
} from "../../controllers/Dentalchart.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize())
  .post(createDental_Chart_Examinations)
  .get(getAllDental_Chart_Examinations);

// =======================Periodical Chart routes=========================
router
  .route("/periodicalchart/:id")
  .all(validateToken)
  .put(updatePeriodicalChart)
  .delete(deletePeriodicalChart);

router
  .route("/periodicalchart")
  .all(validateToken)
  .post(createPeriodicalChart)
  .get(getPeriodicalChart);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getDental_Chart_ExaminationsById)
  .put(updateDental_Chart_Examinations)
  .delete(deleteDental_Chart_Examinations);

export default router;
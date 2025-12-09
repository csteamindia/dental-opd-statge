import express from "express";
import { getAllExamination_Types } from "../../controllers/Examination_Types.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router.route("/").all(validateToken, authorize()).get(getAllExamination_Types);

export default router;

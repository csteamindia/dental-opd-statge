import express from "express";
import {
  createBankDeposites,
  getAllBankDeposites,
  getBankDepositesById,
  updateBankDeposites,
  deleteBankDeposites,
} from "../../controllers/BankDeposits.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/")
  .all(validateToken, authorize())
  .post(createBankDeposites)
  .get(getAllBankDeposites);

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getBankDepositesById)
  .put(updateBankDeposites)
  .delete(deleteBankDeposites);

export default router;

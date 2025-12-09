import express from "express";
import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateAccounts,
  deleteAccounts,
  createBilling,
  getAllBills,
  cancelBilling
} from "../../controllers/Accounts.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router
  .route("/voucher/:id")
  .all(validateToken, authorize())
  .get(getVoucherById)
  .put(updateAccounts)
  .delete(deleteAccounts);

router
  .route("/voucher")
  .all(validateToken, authorize())
  .post(createVoucher)
  .get(getAllVouchers);

router
  .route("/billing")
  .all(validateToken, authorize())
  .post(createBilling)
  .get(getAllBills);

router
  .route("/billing/cancel/:id")
  .all(validateToken, authorize())
  .get(cancelBilling);

// router
//   .route("/:id")
//   .all(validateToken, authorize())
//   .get(getAccountsById)
//   .put(updateAccounts)
//   .delete(deleteAccounts);

export default router;

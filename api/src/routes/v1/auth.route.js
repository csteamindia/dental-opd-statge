/* eslint-disable max-len */
import express from "express"
import validateToken from "../../middlewares/validate-token.js"
import {
  newRegistration,
  login,
  resendVerificationmail,
  verificationMail,
  checkVerifiedAccount,
  updatePassword,
} from "../../controllers/Auth.controller.js"

const router = express.Router()
router.route("/registration").post(newRegistration)

router.route("/login").post(login)

router.route("/resend-verification").get(resendVerificationmail)

router.route("/update-password").all(validateToken).post(updatePassword)

router.route("/verify-email").get(verificationMail)

router
  .route("/check-account-status")
  .all(validateToken)
  .get(checkVerifiedAccount)

export default router

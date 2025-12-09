import express from "express";
import { updateNotification, wpTemplates, getWPTemplates, updateWPTemplates  } from "../../controllers/Notifications.controller.js";
import validateToken from "../../middlewares/validate-token.js";
import { authorize } from "../../middlewares/authorize.js";
import { validateUnis } from "../../middlewares/updatevalidate.js";

const router = express.Router();

router
  .route("/wp/templates")
  .all(validateToken)
  .post(wpTemplates)
  .get(getWPTemplates)
  .put(updateWPTemplates);

router
  .route("/:id")
  .all(validateToken, authorize())
  .put(validateUnis, updateNotification);

export default router;

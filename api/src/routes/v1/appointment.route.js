import express from "express"
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getTodoAppointments,
  cancelAppointment,
  updateReportingTime,
  getappdata,
  startTimeApp,
  endTimeApp,
} from "../../controllers/Appointments.controller.js"
import validateToken from "../../middlewares/validate-token.js"
import { authorize } from "../../middlewares/authorize.js"

const router = express.Router()

router
  .route("/")
  .all(validateToken, authorize())
  .post(createAppointment)
  .get(getAllAppointments)

router.route("/cancel").all(validateToken, authorize()).post(cancelAppointment)

router.route("/todo").all(validateToken, authorize()).get(getTodoAppointments)

router
  .route("/reporting")
  .all(validateToken, authorize())
  .get(updateReportingTime)

router.route("/getappdata").all(validateToken, authorize()).get(getappdata)
router
  .route("/starttime/:id")
  .all(validateToken, authorize())
  .post(startTimeApp)
router.route("/endtime/:id").all(validateToken, authorize()).post(endTimeApp)

router
  .route("/:id")
  .all(validateToken, authorize())
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment)

export default router

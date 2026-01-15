import express from "express"
import {
  makeAppointmentExprier,
  dayAppointmentReminderForDoctorandPatient,
  tommarowAppointmentReminderForPatient,
  greetingNotification,
  reminderCurlCall,
} from "../controllers/Curl.controller.js"

const router = express.Router()
//   set CORn for 23:59 once
router.route("/update-exprire-appointments").get(makeAppointmentExprier)

//   set CORn for 00:00 once
router
  .route("/doctor-appointment-reminder")
  .get(dayAppointmentReminderForDoctorandPatient)

//   set CORn for 19:40 once
router
  .route("/tommarow-appointment-reminder-patient")
  .get(tommarowAppointmentReminderForPatient)

//   set CORn for 05:00 once
router.route("/greetings").get(greetingNotification)
router.route("/reminder").get(reminderCurlCall)

export default router

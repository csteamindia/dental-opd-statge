import httpStatus from "http-status"
import * as response from "../middlewares/response-handler.js"
import {
  makeAppointmentExprierService,
  dayAppointmentReminderForDoctorandPatientService,
  tommarowAppointmentReminderForPatientService,
  greetingNotificationService,
  reminderCurlCallService,
} from "../services/Curl.service.js"

const responseHandler = response.default

const makeAppointmentExprier = async (req, res) => {
  try {
    const data = await makeAppointmentExprierService(req)
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false))
    }
    res.status(httpStatus.OK).send(responseHandler(data))
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false))
  }
}

const dayAppointmentReminderForDoctorandPatient = async (req, res) => {
  try {
    const data = await dayAppointmentReminderForDoctorandPatientService(req)
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false))
    }
    res.status(httpStatus.OK).send(responseHandler(data))
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false))
  }
}

const tommarowAppointmentReminderForPatient = async (req, res) => {
  try {
    const data = await tommarowAppointmentReminderForPatientService(req)
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false))
    }
    res.status(httpStatus.OK).send(responseHandler(data))
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false))
  }
}

const appointmentREminderForPatient = async (req, res) => {
  try {
    const data = await appointmentREminderForPatientService(req)
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false))
    }
    res.status(httpStatus.OK).send(responseHandler(data))
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false))
  }
}

const greetingNotification = async (req, res) => {
  try {
    const data = await greetingNotificationService(req)
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false))
    }
    res.status(httpStatus.OK).send(responseHandler(data))
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false))
  }
}

const reminderCurlCall = async (req, res) => {
  try {
    const start = new Date()
    start.setUTCDate(start.getUTCDate())
    start.setHours(6, 0, 0, 0)

    const end = new Date()
    end.setUTCDate(end.getUTCDate())
    end.setHours(6, 0, 59, 999)

    const data = await reminderCurlCallService({ start, end })
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false))
    }
    res.status(httpStatus.OK).send(responseHandler(data))
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false))
  }
}

export {
  makeAppointmentExprier,
  dayAppointmentReminderForDoctorandPatient,
  tommarowAppointmentReminderForPatient,
  appointmentREminderForPatient,
  greetingNotification,
  reminderCurlCall,
}

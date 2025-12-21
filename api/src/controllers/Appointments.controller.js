/* eslint-disable max-len */

import httpStatus from "http-status"
import * as response from "../middlewares/response-handler.js"
import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  getDoc,
  getTodoAppointmentsService,
  cancelAppointmentService,
  updateReportingTimeService,
  getappdataService,
  startTimeAppService,
  endTimeAppService,
} from "../services/Appointments.service.js"
import momment from "moment"

const responseHandler = response.default

const createAppointment = async (req, res) => {
  try {
    const data = await createAppointmentService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.error || "Failed to create appointment"
          )
        )
    }
    res.status(httpStatus.CREATED).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const data = await cancelAppointmentService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.error || "Failed to cancel appointment"
          )
        )
    }
    res.status(httpStatus.CREATED).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const getAllAppointments = async (req, res) => {
  try {
    const data = await getAllAppointmentsService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.error || "Failed to fetch appointments"
          )
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const getTodoAppointments = async (req, res) => {
  try {
    const { tokendata } = req
    const data = await getTodoAppointmentsService(req)

    const _class = {
      _0: "bg-warning",
      _1: "bg-success",
      _2: "bg-danger",
    }

    // console.log("================================================")
    // console.log(tokendata)
    // console.log("================================================")
    // const getDocOCde = getDoc(tokendata.email);

    // const newData = data?.map(item => {
    //   const datetime = item.canceled_at != null ? `Cancelled : \n ${momment(item.canceled_at).format('YYYY-MM-DD HH:mm')}` : `${momment(item?.appointment_date).format('HH:mm')} - ${momment(item?.appointment_date).add(20, 'minutes').format('HH:mm')}`;

    //   const title = `${item?.patient?.first_name} ${item?.patient?.last_name} (${item?.patient?.case_no})\nNote: ${item?.notes}\n ${datetime}`;
    //     return {
    //       is_show: (getDocOCde.id != tokendata.client_id  && getDocOCde.code != item.doctor_code) ? false: true,
    //       title: (getDocOCde.id != tokendata.client_id  && getDocOCde.code == item.doctor_code) ? false: true,
    //       start: momment(item.appointment_date).format('YYYY-MM-DD HH:mm'),
    //       end: momment(item.appointment_date).add(20, 'minutes').format('YYYY-MM-DD HH:mm'),
    //       className: _class[`_${item?.is_visited}`],
    //       ...item,
    //       appointment_date: momment(item.appointment_date).format('YYYY-MM-DD HH:mm'),
    //       canceled_at: momment(item.canceled_at).format('YYYY-MM-DD HH:mm')
    //     }
    // });

    const docData =
      tokendata.role === "Receptionist" ? true : await getDoc(tokendata.email)

    const newData = data?.map(item => {
      const datetime =
        item.canceled_at != null
          ? `Cancelled : \n ${momment(item.canceled_at).format(
              "YYYY-MM-DD HH:mm"
            )}`
          : `${momment(item.appointment_date).format("HH:mm")} - ${momment(
              item.appointment_date
            )
              .add(20, "minutes")
              .format("HH:mm")}`

      const isReceptionist = docData === true
      const isAdmin = isReceptionist || docData?.id == tokendata.client_id
      const isSameDoc = isReceptionist || docData?.code == item.doctor_code

      return {
        is_show: isAdmin || isSameDoc,
        title: `${item?.patient?.first_name} ${item?.patient?.last_name} (${item?.patient?.case_no})\nNote: ${item?.notes}\n ${datetime}`,
        start: momment(item.appointment_date).format("YYYY-MM-DD HH:mm"),
        end: momment(item.appointment_date)
          .add(20, "minutes")
          .format("YYYY-MM-DD HH:mm"),
        className: _class[`_${item?.is_visited}`],
        ...item,
        appointment_date: momment(item.appointment_date).format(
          "YYYY-MM-DD HH:mm"
        ),
        reporting_time: item.reporting_time,
        canceled_at: momment(item.canceled_at).format("YYYY-MM-DD HH:mm"),
      }
    })

    res.status(httpStatus.OK).send(responseHandler(newData))
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(e, false))
  }
}

const getAppointmentById = async (req, res) => {
  try {
    const data = await getAppointmentByIdService(req)
    if (!data.success) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(
          responseHandler([], false, data.message || "Appointment not found")
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const updateAppointment = async (req, res) => {
  try {
    const data = await updateAppointmentService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.message || data.error || "Failed to update appointment"
          )
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const deleteAppointment = async (req, res) => {
  try {
    const data = await deleteAppointmentService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.message || data.error || "Failed to delete appointment"
          )
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const updateReportingTime = async (req, res) => {
  try {
    const data = await updateReportingTimeService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.message || data.error || "Failed to delete appointment"
          )
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const getappdata = async (req, res) => {
  try {
    const data = await getappdataService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.message || data.error || "Failed to delete appointment"
          )
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const startTimeApp = async (req, res) => {
  try {
    const data = await startTimeAppService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.message || data.error || "Failed to delete appointment"
          )
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

const endTimeApp = async (req, res) => {
  try {
    const data = await endTimeAppService(req)
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.message || data.error || "Failed to delete appointment"
          )
        )
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true))
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message))
  }
}

export {
  createAppointment,
  getAllAppointments,
  getappdata,
  startTimeApp,
  endTimeApp,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getTodoAppointments,
  cancelAppointment,
  updateReportingTime,
}

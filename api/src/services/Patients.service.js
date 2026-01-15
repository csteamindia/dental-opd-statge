/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */
/* eslint-disable max-len */
import { Sequelize } from "sequelize"
import db from "../models/index.js"
const {
  Doctors,
  Patients,
  Clinics,
  User,
  Patient_Notes,
  Patient_Follow_Up,
  Investigation,
  Examinations,
  DentalChart,
  Tretment,
  Prescription,
  Appointment,
} = db
import { SendWpMessage } from "../controllers/Whatsapp.controller.js"
import {
  sendMailNotification,
  sendWpNotification,
} from "../utils/notification.js"

// Create new patient
const createPatientService = async req => {
  try {
    const { body } = req
    body.doctor = body.client_id

    if (body.id) {
      // Update existing patient
      const [affectedRows] = await Patients.update(body, {
        where: { id: body.id },
      })

      if (affectedRows === 0) {
        throw new Error("Patient not found for update")
      }

      // Manually fetch updated record
      const updatedPatient = await Patients.findByPk(body.id)
      return updatedPatient
    } else {
      // Create new patient
      const newPatient = await Patients.create(body)

      const clinicData = await Clinics.findOne({
        attributes: ["clinic_name", "clinic_url"],
        where: { id: clinic_id },
      })

      const patientName = `${body?.title} ${body?.first_name} ${body?.last_name}`

      const msgData = {
        patientType: "newAppointment",
        patientEmail: body?.email,
        patientMobile: body?.mobile,
        patientName,
        clinicName: clinicData?.clinic_name,
        websiteLink: clinicData?.clinic_url,
      }

      if (body?.email) sendMailNotification(msgData)
      if (body?.mobile) sendWpNotification(msgData)

      if (body?.welcome_checkbox && body?.mobile) {
        SendWpMessage(body, "welcome")
      }

      return newPatient
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const updateProfileService = async req => {
  const {
    body: { files },
    query: { patient_id },
  } = req

  const [affectedRows] = await Patients.update(
    {
      profile_pic: files[0]?.path,
    },
    {
      where: { id: patient_id },
    }
  )

  if (affectedRows === 0) {
    throw new Error("Patient not found for update")
  }

  // Manually fetch updated record
  const updatedPatient = await Patients.findByPk(patient_id)
  return updatedPatient
}

// Get all patients
const getAllPatientsService = async req => {
  try {
    const {
      query: {
        clinic_id,
        communication_group_id,
        client_id,
        page = 1,
        limit = 10,
        q,
      },
      tokendata,
    } = req

    const parsedPage = parseInt(page, 10) || 1
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null

    // Flexible filters
    const where = { status: 0 }
    if (clinic_id) where.clinic_id = clinic_id
    if (client_id) where.client_id = client_id
    if (communication_group_id)
      where.communication_group_id = communication_group_id

    if (tokendata.clinic_id != null) {
      const getChairId = await Appointment.findAll({
        attributes: ["patient_id"],
        where: {
          doctor_code: tokendata.doc_code,
        },
        group: ["patient_id"],
      })
      const ids = getChairId.map(item => item.patient_id)
      where.id = {
        [Sequelize.Op.in]: ids,
      }
    }

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Clinics,
          as: "clinic",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: User,
          as: "client",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      order: [["id", "DESC"]],
    }

    // for filteration

    if (q?.client_id) {
      condition.where = [
        {
          client_id: q?.client_id,
        },
      ]
    }
    if (q?.clinic_id) {
      condition.where = [
        {
          clinic_id: q?.clinic_id,
        },
      ]
    }

    if (parsedLimit) {
      condition.limit = parsedLimit
      condition.offset = offset
    }

    const result = await Patients.findAndCountAll(condition)

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Get all patients
const getPatientByIdViewService = async req => {
  try {
    const { id } = req.params

    const result = await Patients.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      include: [
        {
          model: Clinics,
          as: "clinic",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: User,
          as: "client",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      order: [["id", "DESC"]],
    })

    return result
  } catch (error) {
    console.error("getPatientByIdViewService Error:", error)
    throw error
  }
}

// Get single patient by ID
const getPatientByIdService = async req => {
  try {
    const { id } = req.params
    const { client_id } = req.body

    const result = await Patients.findOne({
      where: {
        id,
        client_id: client_id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    })
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Update patient
const updatePatientService = async req => {
  try {
    const { id } = req.params
    const { body } = req
    const result = await Patients.update(body, {
      where: {
        id,
        status: 0,
      },
    })
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Delete patient (soft delete)
const deletePatientService = async req => {
  try {
    const { id } = req.params
    const { sts } = req.query
    const result = await Patients.update(
      { status: sts },
      {
        where: {
          id,
        },
      }
    )
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

// options patient (soft delete)
const patientsOptionsService = async req => {
  try {
    const { clinic_id } = req.query
    const result = await Patients.findAll({
      attributes: [
        [Sequelize.literal("case_no"), "value"],
        [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), "label"],
      ],
      where: {
        status: 0,
        clinic_id,
      },
    })
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Patient Summary
const patientSummaryService = async req => {
  try {
    const { patient_id } = req.query
    const condition = {
      where: { patient_id: patient_id },
    }

    const profile = await Patients.findOne({
      attributes: [
        "title",
        "first_name",
        "last_name",
        "case_no",
        "dob",
        "age",
        "gender",
        "mobile",
        "email",
        "address",
        "state",
        "city",
        "country",
        "zip_code",
      ],
      where: { id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctors",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    const investigations = await Investigation.findAll({
      attributes: [
        "date",
        "temperature",
        "blood_pressure",
        "blood_sugar",
        "auscultation",
        "note",
      ],
      where: { patient_id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    const appointments = await Appointment.findAll({
      attributes: ["appointment_date", "is_visited", "notes", "updated_at"],
      where: { patient_id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    const prescriptions = await Prescription.findAll({
      attributes: ["date", "medicine", "note"],
      where: { patient_id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    const tretments = await Tretment.findAll({
      attributes: [
        "treatment_date",
        "treatment_type",
        "tooths",
        "treatment_note",
        "treatment_total_cost",
      ],
      where: { patient_id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    const examinations = await Examinations.findAll({
      attributes: ["examination_date", "tooth", "remark"],
      where: { patient_id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctors",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    const dentalChart = await DentalChart.findAll({
      // attributes: [ "followup_date", "remark" ],
      where: { patient_id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    const followups = await Patient_Follow_Up.findAll({
      attributes: ["followup_date", "remark"],
      where: { patient_id: patient_id },
    })

    const notes = await Patient_Notes.findAll({
      where: { patient_id: patient_id },
      include: [
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: ["name"],
        },
      ],
    })

    return {
      profile: profile,
      investigations: investigations,
      examinations: examinations,
      dentalchart: dentalChart,
      prescriptions: prescriptions,
      tretments: tretments,
      appointments: appointments,
      notes: notes,
      followups: followups,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export {
  createPatientService,
  getAllPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
  patientsOptionsService,
  patientSummaryService,
  updateProfileService,
  getPatientByIdViewService,
}

// const generateCaseNo = async (prefix = "CASE", suffix = "") => {
//   // Get sequence from DB
//   let seq = await db.case_sequence.findOne({ where: { prefix, suffix } });

//   if (!seq) {
//     seq = await db.case_sequence.create({ prefix, suffix, current_no: 1 });
//   } else {
//     seq.current_no += 1;
//     await seq.save();
//   }

//   // Pad number (e.g., 0001)
//   const number = seq.current_no.toString().padStart(4, "0");

//   // Format case number
//   return `${prefix ? prefix + "-" : ""}${number}${suffix ? "-" + suffix : ""}`;
// };

// // Example
// console.log(await generateCaseNo("CASE", "2025")); // CASE-0001-2025

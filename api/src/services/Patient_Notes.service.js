import db from "../models/index.js";
import "dotenv/config";
const { Patient_Notes, Clinics, User, Doctors, Patients } = db;

const createPatient_NotesService = async (req) => {
  const { body } = req;
  try {
    const res = await Patient_Notes.create(body);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllPatient_NotesService = async (req) => {
  try {
    const {
      clinic_id,
      client_id,
      patient_id,
      doctor_code,
      page = 1,
      limit = 10,
      query,
    } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (patient_id) where.patient_id = patient_id;
    if (doctor_code) where.doctor_code = doctor_code;

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
        {
          model: Patients,
          as: "patient",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      order: [["id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Patient_Notes.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all Patient_Notes:", e.message);
    return { success: false, message: e.message };
  }
};

const getPatient_NotesByIdService = async (req) => {
  try {
    const { id } = req.params;
    const res = await Patient_Notes.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const deletePatient_NotesService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await Patient_Notes.update({ status: sts }, { where: { id } });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export {
  createPatient_NotesService,
  getAllPatient_NotesService,
  getPatient_NotesByIdService,
  deletePatient_NotesService,
};

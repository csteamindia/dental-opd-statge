import db from "../models/index.js";
import "dotenv/config";
const { Patient_Follow_Up, Clinics, User, Patients } = db;

const createPatient_Follow_UpService = async (req) => {
  const { body } = req;
  try {
    const res = await Patient_Follow_Up.create(body);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllPatient_Follow_UpService = async (req) => {
  try {
    const {
      clinic_id,
      client_id,
      patient_id,
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

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        // {
        //   model: Clinics,
        //   as: "clinic",
        //   required: true,
        //   attributes: { exclude: ["created_at", "updated_at"] },
        // },
        {
          attributes: ['name'],
          model: User,
          as: "client",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Patients,
          attributes: ["mobile"],
          as: "patient",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      order: [["id", "DESC"]],
    };
    if (query?.client_id) {
      condition.where = [
        {
          client_id: query?.client_id,
        },
      ];
    }
    if (query?.clinic_id) {
      condition.where = [
        {
          clinic_id: query?.clinic_id,
        },
      ];
    }

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Patient_Follow_Up.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all Patient_Follow_Up:", e.message);
    return { success: false, message: e.message };
  }
};

const getPatient_Follow_UpByIdService = async (req) => {
  try {
    const { id } = req.params;
    const res = await Patient_Follow_Up.findOne({
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

const deletePatient_Follow_UpService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await Patient_Follow_Up.update(
      { status: sts },
      { where: { id } }
    );
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export {
  createPatient_Follow_UpService,
  getAllPatient_Follow_UpService,
  getPatient_Follow_UpByIdService,
  deletePatient_Follow_UpService,
};

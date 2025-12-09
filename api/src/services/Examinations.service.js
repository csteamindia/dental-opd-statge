import db from "../models/index.js";
import Sequelize from "sequelize";
const { Examinations, Doctors, Clinics, User, Patients } = db;
console.log("Examinations", Examinations);

const createExaminationService = async (req) => {
  try {
    const { body } = req;
    const result = await Examinations.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// Get all Examinations
const getAllExaminationsService = async (req) => {
  try {
    const { query } = req;
    const page = parseInt(query.page) || 1;
    const limit = query.limit === "all" ? "all" : parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const condition = {
      where: { patient_id: query.patient_id, },
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
          as: "doctors",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],

      order: [["id", "DESC"]],
    };

    if (limit !== "all") {
      condition.limit = limit;
      condition.offset = offset;
    }

    const result = await Examinations.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: limit === "all" ? 1 : Math.ceil(result.count / limit),
      currentPage: limit === "all" ? 1 : page,
      items: result.rows,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getExaminationByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await Examinations.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });

    if (!result) {
      throw new Error("Examination not found");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateExaminationService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Examinations.update(body, {
      where: {
        id,
        status: 0,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteExaminationService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await Examinations.update(
      { status: sts },
      {
        where: {
          id,
        },
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  createExaminationService,
  getAllExaminationsService,
  getExaminationByIdService,
  updateExaminationService,
  deleteExaminationService,
};

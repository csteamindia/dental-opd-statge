import db from "../models/index.js";
import "dotenv/config";
const { Examination_Types, Clinics, User, Sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from '../utils/Basicutils.js'

export const getAllExamination_TypesService = async (req) => {
  try {
    const { query: { clinic_id, client_id, page = 1, limit = 10 } } = req;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};

    if (clinic_id) {
      const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
      where.clinic_id = { [Sequelize.Op.in]: [cId] }
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
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Examination_Types.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all Examination_Types:", e.message);
    return { success: false, message: e.message };
  }
};

import db from "../models/index.js";
import "dotenv/config";
const { DentalChartToothsExaminations, Clinics, User, Sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from '../utils/Basicutils.js';

const createDentalChartToothsExaminationService = async (req) => {
  const { body } = req;

  try {
    if (body.id) {
      // If ID exists, update the record
      const [updatedCount] = await DentalChartToothsExaminations.update(body, {
        where: { id: body.id },
      });

      if (updatedCount === 0) {
        throw new Error("Update failed: No record found with the given ID.");
      }

      // Return the updated record
      const updatedRecord = await DentalChartToothsExaminations.findByPk(body.id);
      return updatedRecord;
    } else {
      // If no ID, create a new record
      const res = await DentalChartToothsExaminations.create(body);
      return res;
    }
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllDentalChartToothsExaminationService = async (req) => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;
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

    const result = await DentalChartToothsExaminations.findAndCountAll(
      condition
    );

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error(
      "Error fetching all DentalChartToothsExaminations:",
      e.message
    );
    return { success: false, message: e.message };
  }
};

const getAllDentalChartToothsExaminationOptionsService = async (req) => {
  try {
    const { query: { clinic_id, client_id } } = req;

    const where = {};
    if (clinic_id) {
      const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
      where.clinic_id = { [Sequelize.Op.in]: [cId] }
    }

    if(client_id) {
      where.client_id = {
          [Sequelize.Op.or]: [client_id, null]
      };
    }


    const result = await DentalChartToothsExaminations.findAll({
      attributes: [
        [Sequelize.literal('title'), 'label'],
        [Sequelize.literal('group_'), 'group']
      ],
      where,
      order: [["id", "DESC"]],
    });

    return result;
  } catch (e) {
    console.error(
      "Error fetching all DentalChartToothsExaminations:",
      e.message
    );
    return { success: false, message: e.message };
  }
};

const getDentalChartToothsExaminationByIdService = async (req) => {
  try {
    const { id } = req.params;
    const res = await DentalChartToothsExaminations.findOne({
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

const updateDentalChartToothsExaminationService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const res = await DentalChartToothsExaminations.update(body, {
      where: {
        id,
        status: 0,
      },
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const deleteDentalChartToothsExaminationService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await DentalChartToothsExaminations.update(
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
  createDentalChartToothsExaminationService,
  getAllDentalChartToothsExaminationService,
  getDentalChartToothsExaminationByIdService,
  updateDentalChartToothsExaminationService,
  deleteDentalChartToothsExaminationService,
  getAllDentalChartToothsExaminationOptionsService
};
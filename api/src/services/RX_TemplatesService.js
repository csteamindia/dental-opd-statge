import db from "../models/index.js";
import "dotenv/config";
const {
  RX_Templates,
  Clinics,
  // User,
  Doctors,
  // Mediciens,
  // Prescription,
  // sequelize,
} = db;

const createRX_TemplatesService = async req => {
  const { body } = req;
  try {
    if (body.id) {
      const [affectedRows] = await RX_Templates.update(body, {
        where: { id: body.id },
      });

      if (affectedRows > 0) {
        return await RX_Templates.findByPk(body.id);
      } else {
        throw new Error("Update failed. Record not found.");
      }
    } else {
      const res = await RX_Templates.create(body);
      return res;
    }
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllRX_TemplatesService = async req => {
  try {
    const {
      query: { prescription_id,
        clinic_id,
        client_id,
        doctor_code,
        page = 1,
        limit = 10 }
    } = req;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};
    if (prescription_id) where.prescription_id = prescription_id;
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (doctor_code) where.doctor_code = doctor_code;

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        // {
        //   model: Prescription,
        //   as: "prescription",
        //   required: false,
        //   attributes: { exclude: ["created_at", "updated_at"] },
        // },
        {
          model: Clinics,
          as: "clinic",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        // {
        //   model: User,
        //   as: "client",
        //   required: true,
        //   attributes: { exclude: ["created_at", "updated_at"] },
        // },
        {
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        // {
        //   model: Mediciens,
        //   as: "Medicine",
        //   required: true,
        //   attributes: { exclude: ["created_at", "updated_at"] },
        // },
      ],
      order: [["id", "DESC"]],
      group: 'code'
    };
    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await RX_Templates.findAndCountAll(condition);
    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all RX_Templates:", e.message);
    return { success: false, message: e.message };
  }
};

const getRX_TemplatesByIdService = async req => {
  try {
    const { id } = req.params;
    const res = await RX_Templates.findOne({
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

const updateRX_TemplatesService = async req => {
  try {
    const { id } = req.params;
    const { body } = req;
    const res = await RX_Templates.update(body, {
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

const deleteRX_TemplatesService = async req => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await RX_Templates.update({ status: sts }, { where: { id } });
    return res;
  } catch (error) {
    console.log('Error deleting RX Templates Type:', error);
    throw error;
  }
};

export {
  createRX_TemplatesService,
  getAllRX_TemplatesService,
  getRX_TemplatesByIdService,
  updateRX_TemplatesService,
  deleteRX_TemplatesService,
};

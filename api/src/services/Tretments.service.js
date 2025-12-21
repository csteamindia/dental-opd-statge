import db from "../models/index.js";
const { TretmentNotes, Tretment, TretmentTypes, Clinics, Doctors, Sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from '../utils/Basicutils.js'

const createTreatmentService = async req => {
  try {
    const { body } = req;
    if (!body.clinic_id) {
      throw new Error("Missing required fields: title, cost, or clinic_id");
    }

    const finalObj = body._q?.map(v => {
      v.clinic_id = body.clinic_id;
      v.client_id = body.client_id;
      return v
    })

    console.log(finalObj);

    return await Tretment.bulkCreate(finalObj);
  } catch (error) {
    console.error("Error creating treatment:", error.message);
    throw error; // rethrow the error to be handled by the controller
  }
};

// Add treatment type Service
const addTreatmentTypeService = async req => {
  try {
    const { body } = req;
    if (!body.clinic_id) {
      throw new Error("Missing required fields: title, cost, or clinic_id");
    }

    return await TretmentTypes.create(body);
  } catch (error) {
    console.error("Error creating treatment:", error.message);
    throw error;
  }
};

// Get all treatments
const getAllTreatmentsService = async req => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, patient_id } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};
    if (patient_id) where.patient_id = patient_id;
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;

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
          model: Doctors,
          as: "doctor",
          attributes: ['name']
        },
        {
          model: TretmentNotes,
          as: "notes"
        },
      ],
      order: [["id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Tretment.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error("Error fetching treatments:", error.message);
    throw error;
  }
};

// Get all treatment type Service
const getAllTreatmentTypeService = async req => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};
    if (clinic_id) {
      const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
      where.clinic_id = { [Sequelize.Op.in]: [cId] }
    }

    if (client_id) {
      where.client_id = {
        [Sequelize.Op.or]: [null, client_id]
      };
    }

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      order: [["id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await TretmentTypes.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error("Error fetching treatments:", error.message);
    throw error;
  }
};

// Get single treatment by ID
const getTreatmentByIdService = async req => {
  try {
    const { id } = req.params;
    const result = await TretmentTypes.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update treatment
const updateTreatmentService = async req => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await TretmentTypes.update(body, {
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

// Update treatment Type
const updateTreatmentTypeService = async req => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await TretmentTypes.update(body, {
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

// Delete treatment (soft delete)
const deleteTreatmentService = async req => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await TretmentTypes.update({ status: sts }, { where: { id, }, });
    return result;
  } catch (error) {
    console.log('Error deleting Treatment Type:', error);
    throw error;
  }
};

// Delete treatment type (soft delete)
const deleteTreatmentTypeService = async req => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await TretmentTypes.update({ status: sts }, { where: { id }, });
    return result;
  } catch (error) {
    console.log('Error deleting Treatment Type:', error);
    throw error;
  }
};

const addTreatmentStatusService = async req => {
  try {
    const { params: {id}, query: {sts} } = req;
    const result = await Tretment.update({ treatment_status: sts }, { where: { id: id }, });
    return result;
  } catch (error) {
    console.log('Error deleting Treatment Type:', error);
    throw error;
  }
};

export {
  createTreatmentService,
  getAllTreatmentsService,
  addTreatmentStatusService,
  getTreatmentByIdService,
  updateTreatmentService,
  deleteTreatmentService,
  addTreatmentTypeService,
  deleteTreatmentTypeService,
  updateTreatmentTypeService,
  getAllTreatmentTypeService
};

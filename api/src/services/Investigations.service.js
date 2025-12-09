import db from "../models/index.js";
const { Investigation, Clinics, Patients, Doctors, Examinations } = db;

// Create new investigation
const createInvestigationService = async (req) => {
  try {
    const { body } = req;
    const result = await Investigation.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all investigations
const getAllInvestigationsService = async (req) => {
  try {
    const {
      clinic_id,
      patient_id,
      client_id,
      doctor_id,
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
    if (doctor_id) where.doctor_id = doctor_id;

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
        // {
        //   model: Examinations,
        //   as: "examination",
        //   required: false,
        //   attributes: { exclude: ["created_at", "updated_at"] },
        // },
      ],
      order: [["id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Investigation.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

// Get single investigation by ID
const getInvestigationByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await Investigation.findOne({
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

// Update investigation
const updateInvestigationService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Investigation.update(body, {
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

// Delete investigation (soft delete)
const deleteInvestigationService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await Investigation.update(
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
  createInvestigationService,
  getAllInvestigationsService,
  getInvestigationByIdService,
  updateInvestigationService,
  deleteInvestigationService,
};

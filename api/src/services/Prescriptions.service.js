import db from "../models/index.js";
const { Prescription, Clinics, User, Doctors, Mediciens } = db;

// Create new prescription
const createPrescriptionService = async (req) => {
  try {
    const { body } = req;
    const result = await Prescription.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all prescriptions

const getAllPrescriptionsService = async (req) => {
  try {
    const {
      clinic_id,
      medicine,
      client_id,
      doctor_id,
      patient_id,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};
    // if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (doctor_id) where.doctor_id = doctor_id;
    if (medicine) where.medicine = medicine;
    if (patient_id) where.patient_id = patient_id;

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
          model: Doctors,
          as: "doctor",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Mediciens,
          as: "medicines",
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

    const result = await Prescription.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw error;
  }
};

// Get single prescription by ID
const getPrescriptionByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await Prescription.findOne({
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

// Update prescription
const updatePrescriptionService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Prescription.update(body, {
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

// Delete prescription (soft delete)
const deletePrescriptionService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await Prescription.update(
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
  createPrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,
  updatePrescriptionService,
  deletePrescriptionService,
};

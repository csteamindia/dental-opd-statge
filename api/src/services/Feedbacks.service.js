import db from "../models/index.js";
const { Feedback, Clinics, User, Patients, Doctors } = db;

// Create new feedback
const createFeedbackService = async (req) => {
  try {
    const { body } = req;
    const result = await Feedback.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all feedbacks
const getAllFeedbacksService = async (req) => {
  try {
    const {
      clinic_id,
      client_id,
      doctor_code,
      patient_code,
      page = 1,
      limit = 10,
      query,
    } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = { status: 0 };
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (patient_code) where.patient_code = patient_code;
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
    if (query?.patient_code) {
      condition.where = [
        {
          patient_code: query?.patient_code,
        },
      ];
    }
    if (query?.doctor_code) {
      condition.where = [
        {
          doctor_code: query?.doctor_code,
        },
      ];
    }

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Feedback.findAndCountAll(condition);

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

// Get single feedback by ID
const getFeedbackByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await Feedback.findOne({
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

// Update feedback
const updateFeedbackService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Feedback.update(body, {
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

// Delete feedback (soft delete)
const deleteFeedbackService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await Feedback.update(
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
  createFeedbackService,
  getAllFeedbacksService,
  getFeedbackByIdService,
  updateFeedbackService,
  deleteFeedbackService,
};

import moment from "moment";
import db from "../models/index.js";
const { Files, Clinics, User } = db;

// Create new file
const createFileService = async (req, res) => {
  try {
    const { body: { file_type, remark, files }, query: { client_id, clinic_id, patient_id } } = req;

    const obj = {
      file_type,
      description:remark,
      file_path: JSON.stringify(files),
      clinic_id,
      client_id,
      patient_id,
    }
    return await Files.create(obj);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all files
const getAllFilesService = async (req) => {
  try {
    const { patient_id, clinic_id, client_id, page = 1, limit = 10, query } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = { status: 0 };
    if (clinic_id) where.patient_id = patient_id;
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;

    const condition = {
      where,
      attributes: { exclude: ["updated_at"] },
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
      order: [["created_at", "DESC"]],
    };
    
    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Files.findAndCountAll(condition);

    const groupedByDate = result.rows.reduce((groups, item) => {
      const dateKey = moment(item.created_at).format('DD-MM-YYYY');
      console.log(dateKey, item)
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
      return groups;
    }, {});

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: groupedByDate,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

// Get single file by ID
const getFileByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await Files.findOne({
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

// Update file
const updateFileService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Files.update(body, {
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

// Delete file (soft delete)
const deleteFileService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await Files.update(
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
  createFileService,
  getAllFilesService,
  getFileByIdService,
  updateFileService,
  deleteFileService
};

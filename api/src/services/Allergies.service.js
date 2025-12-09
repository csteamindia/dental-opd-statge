import db from "../models/index.js";
const { Allergies, User, Clinics, Sequelize, sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from "../utils/Basicutils.js";

// Create new allergy
const createAllergyService = async (req) => {
  try {
    const { body } = req;
    const result = await Allergies.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// Get all allergies
const getAllAllergiesService = async (req) => {
  try {
    const { query: { client_id, clinic_id, page = 1, limit = 10 } } = req;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit == "all" ? null : parseInt(limit, 10) || 10;
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
      attributes: ["id", "title", "clinic_id", "client_id", "status"],
      include: [
        {
          model: Clinics,
          as: "clinic",
          required: false,
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

    if (limit !== "all") {
      condition.limit = parseInt(limit);
      condition.offset = parseInt(offset);
    }

    const result = await Allergies.findAndCountAll(condition);

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

// Get single allergy by ID
const getAllergyByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await Allergies.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });

    if (!result) {
      throw new Error("Allergy not found");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update allergy
const updateAllergyService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Allergies.update(body, {
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

// Delete allergy (soft delete)
const deleteAllergyService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await Allergies.update(
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
  createAllergyService,
  getAllAllergiesService,
  getAllergyByIdService,
  updateAllergyService,
  deleteAllergyService,
};

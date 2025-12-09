// src/services/ReferenceTypes.service.js
import db from '../models/index.js';
const { ReferenceTypes, Clinics, User, Sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from '../utils/Basicutils.js'

// Create new Reference Type
const createReferenceTypeService = async (req) => {
  try {
    const { body } = req;
    const result = await ReferenceTypes.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all Reference Types
const getAllReferenceTypesService = async (req) => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};

    const condition = {
      where,
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: Clinics,
          as: 'clinic',
          required: true,
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
        {
          model: User,
          as: 'client',
          required: false,
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
      ],
      order: [['id', 'DESC']],
    };

    if (clinic_id) {
      const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
      condition.where.clinic_id = { [Sequelize.Op.in]: [cId] }
    }

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await ReferenceTypes.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error('Error fetching reference types:', error);
    throw error;
  }
};


// Get single Reference Type by ID
const getReferenceTypeByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await ReferenceTypes.findOne({
      where: {
        id,
        status: 0
      },
      attributes: { exclude: ['created_at', 'updated_at'] },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update Reference Type
const updateReferenceTypeService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await ReferenceTypes.update(body, {
      where: {
        id,
        status: 0
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete Reference Type (soft delete)
const deleteReferenceTypeService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query
    const result = await ReferenceTypes.update(
      { status: sts },
      {
        where: {
          id
        }
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  createReferenceTypeService,
  getAllReferenceTypesService,
  getReferenceTypeByIdService,
  updateReferenceTypeService,
  deleteReferenceTypeService
};

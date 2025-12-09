// services/Mediciens.service.js
import db from '../models/index.js';
const { Mediciens, Clinics, User, Sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from "../utils/Basicutils.js";

// Create new medicien
const createMedicienService = async req => {
  try {
    const { body } = req;
    const result = await Mediciens.create(body);
    return result;
  } catch (error) {
    console.error('Error creating medicien:', error);
    throw error;
  }
};

// Get all mediciens
const getAllMediciensService = async req => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    // Flexible filters
    const where = {};
    if (clinic_id) {
      const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
      where.clinic_id = { [Sequelize.Op.in]: [cId] }
    }

    if(client_id){
      where[Sequelize.Op.or] = [
        { client_id: null },
        { client_id: client_id }
      ];
    }

    const condition = {
      where,
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: Clinics,
          as: 'clinic',
          required: false,
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

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Mediciens.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error('Error fetching mediciens:', error);
    throw error;
  }
};



// Get single medicien by ID
const getMedicienByIdService = async req => {
  try {
    const { id } = req.params;
    const result = await Mediciens.findOne({
      where: {
        id,
        status: 0
      },
      attributes: { exclude: ['created_at', 'updated_at'] },
    });
    return result;
  } catch (error) {
    console.error('Error fetching medicien by ID:', error);
    throw error;
  }
};

// Update medicien
const updateMedicienService = async req => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Mediciens.update(body, {
      where: {
        id,
        status: 0
      }
    });
    return result;
  } catch (error) {
    console.error('Error updating medicien:', error);
    throw error;
  }
};

// Delete medicien (soft delete)
const deleteMedicienService = async req => {
  try {
    const { id } = req.params;
    const { sts } = req.query;

    const result = await Mediciens.update(
      { status: sts },
      { where: { id, }, }
    );

    return result;
  } catch (error) {
    console.log('Error deleting Treatment Type:', error);
    throw error;
  }
};

export {
  createMedicienService,
  getAllMediciensService,
  getMedicienByIdService,
  updateMedicienService,
  deleteMedicienService
};

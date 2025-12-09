/* eslint-disable max-len */
/**
 * mediciens controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createMedicienService,
  getAllMediciensService,
  getMedicienByIdService,
  updateMedicienService,
  deleteMedicienService
} from '../services/Mediciens.service.js';

const responseHandler = response.default;

// Create new medicien
const createMedicien = async (req, res) => {
  try {
    const data = await createMedicienService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    console.error('Error in createMedicien controller:', e);
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all mediciens
const getAllMediciens = async (req, res) => {
  try {
    const data = await getAllMediciensService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    console.error('Error in getAllMediciens controller:', e);
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get medicien by ID
const getMedicienById = async (req, res) => {
  try {
    const data = await getMedicienByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Medicine not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};


// Update medicien
const updateMedicien = async (req, res) => {
  try {
    const data = await updateMedicienService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    console.error('Error in updateMedicien controller:', e);
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete medicien
const deleteMedicien = async (req, res) => {
  try {
    const data = await deleteMedicienService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    console.error('Error in deleteMedicien controller:', e);
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createMedicien,
  getAllMediciens,
  getMedicienById,
  updateMedicien,
  deleteMedicien
};

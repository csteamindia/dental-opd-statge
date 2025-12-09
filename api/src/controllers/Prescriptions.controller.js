/* eslint-disable max-len */
/**
 * Prescription controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createPrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,
  updatePrescriptionService,
  deletePrescriptionService
} from '../services/Prescriptions.service.js';

const responseHandler = response.default;

// Create new prescription
const createPrescription = async (req, res) => {
  try {
    const data = await createPrescriptionService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const data = await getAllPrescriptionsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    const data = await getPrescriptionByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Prescription not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false));
  }
};


// Update prescription
const updatePrescription = async (req, res) => {
  try {
    const data = await updatePrescriptionService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete prescription
const deletePrescription = async (req, res) => {
  try {
    const data = await deletePrescriptionService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
};

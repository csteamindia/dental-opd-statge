/* eslint-disable max-len */
/**
 * patients controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createPatientService,
  getAllPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
  patientsOptionsService,
  patientSummaryService,
  updateProfileService,
  getPatientByIdViewService
} from '../services/Patients.service.js';

const responseHandler = response.default;

// Patient Summary
const patientSummary = async (req, res) => {
  try {
    const data = await patientSummaryService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Create new patient
const createPatient = async (req, res) => {
  try {
    const data = await createPatientService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    console.log('getAllPatients', req.query);
    const data = await getAllPatientsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get patient by ID
const getPatientById = async (req, res) => {
  try {
    const data = await getPatientByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Patient not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};

const getPatientByIdView = async (req, res) => {
  try {
    const data = await getPatientByIdViewService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Patient not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const data = await updatePatientService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete patient
const deletePatient = async (req, res) => {
  try {
    const data = await deletePatientService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete patient
const patientsOptions = async (req, res) => {
  try {
    const data = await patientsOptionsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete patient
const updateProfile = async (req, res) => {
  try {
    const data = await updateProfileService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  patientsOptions,
  patientSummary,
  updateProfile,
  getPatientByIdView
};

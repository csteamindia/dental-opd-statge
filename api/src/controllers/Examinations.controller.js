/* eslint-disable max-len */
/**
 * location controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import { createExaminationService, getAllExaminationsService, getExaminationByIdService, updateExaminationService, deleteExaminationService } from '../services/Examinations.service.js';

const responseHandler = response.default;

// Create new allergy

const createExamination = async (req, res) => {
  try {
    const data = await createExaminationService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all Examinations
const getAllExaminations = async (req, res) => {
  try {
    const data = await getAllExaminationsService(req);
    console.log("------------------>", data);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get allergy by ID
const getExaminationById = async (req, res) => {
  try {
    const data = await getExaminationByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler([], false, "Examination not found"));
    }
    return res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false, e.message));
  }
};

// Update allergy
const updateExamination = async (req, res) => {
  try {
    const data = await updateExaminationService(req);
    if (data[0] === 0) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(null,false,"Examination not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false, e.message));
  }
};


// Delete allergy
const deleteExamination = async (req, res) => {
  try {
    const data = await deleteExaminationService(req);
    if (!data[0]) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Examination not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(null, true, "Examination deleted successfully"));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false, e.message));
  }
};


export {
  createExamination,
  getAllExaminations,
  getExaminationById,
  updateExamination,
  deleteExamination
};

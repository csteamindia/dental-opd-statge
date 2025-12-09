/* eslint-disable max-len */
/**
 * Investigation controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createInvestigationService,
  getAllInvestigationsService,
  getInvestigationByIdService,
  updateInvestigationService,
  deleteInvestigationService
} from '../services/Investigations.service.js';

const responseHandler = response.default;

// Create new investigation
const createInvestigation = async (req, res) => {
  try {
    const data = await createInvestigationService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all investigations
const getAllInvestigations = async (req, res) => {
  try {
    const data = await getAllInvestigationsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get investigation by ID
const getInvestigationById = async (req, res) => {
  try {
    const data = await getInvestigationByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Investigation not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};


// Update investigation
const updateInvestigation = async (req, res) => {
  try {
    const data = await updateInvestigationService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete investigation (soft delete)
const deleteInvestigation = async (req, res) => {
  try {
    const data = await deleteInvestigationService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createInvestigation,
  getAllInvestigations,
  getInvestigationById,
  updateInvestigation,
  deleteInvestigation
};

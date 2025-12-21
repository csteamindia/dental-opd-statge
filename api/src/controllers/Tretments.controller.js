/* eslint-disable max-len */
/**
 * Treatment controller
 *
 * @author Your Name
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createTreatmentService,
  getAllTreatmentsService,
  getTreatmentByIdService,
  updateTreatmentService,
  deleteTreatmentService,
  deleteTreatmentTypeService,
  updateTreatmentTypeService,
  addTreatmentTypeService, // type services 
  getAllTreatmentTypeService,
  addTreatmentStatusService
} from '../services/Tretments.service.js';

const responseHandler = response.default;

// Create new treatment
const createTreatment = async (req, res) => {
  try {
    const data = await createTreatmentService(req);

    // If the service returns an error (validation or database)
    if (data.errors) {
      return res.status(httpStatus.BAD_REQUEST).send(responseHandler(data.errors[0].message, false));
    }

    res.status(httpStatus.CREATED).send(responseHandler(data));
  } catch (e) {
    console.error('Error in createTreatment controller:', e.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false, 'An error occurred while creating the treatment.'));
  }
};

// Get all treatments
const getAllTreatments = async (req, res) => {
  try {
    const data = await getAllTreatmentsService(req);

    if (data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler([], false, 'No treatments found.'));
    }

    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    console.error('Error in getAllTreatments controller:', e.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false, 'An error occurred while fetching treatments.'));
  }
};

// Add treatment-type here
const addTreatmentType = async (req, res) => {
  try {
    const data = await addTreatmentTypeService(req);

    if (data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler([], false, 'No treatment types found.'));
    }

    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    console.error('Error in getAllTreatments controller:', e.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false, 'An error occurred while fetching treatments.'));
  }
};

// Get all treatment types
const getAllTreatmentTypes = async (req, res) => {
  try {
    const data = await getAllTreatmentTypeService(req);
    if (data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler([], false, 'No treatments found.'));
    }

    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    console.error('Error in getAllTreatments controller:', e.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false, 'An error occurred while fetching treatments.'));
  }
};


// Get treatment by ID
const getTreatmentById = async (req, res) => {
  try {
    const data = await getTreatmentByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Treatment not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false));
  }
};

// Update treatment
const updateTreatment = async (req, res) => {
  try {
    const data = await updateTreatmentService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Update treatment
const updateTreatmentType = async (req, res) => {
  try {
    const data = await updateTreatmentTypeService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete treatment
const deleteTreatment = async (req, res) => {
  try {
    const data = await deleteTreatmentService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete treatment
const deleteTreatmentType = async (req, res) => {
  try {
    const data = await deleteTreatmentTypeService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const addTreatmentStatus = async (req, res) => {
  try {
    const data = await addTreatmentStatusService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createTreatment,
  getAllTreatments,
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
  deleteTreatmentType,
  addTreatmentType,
  updateTreatmentType,
  addTreatmentStatus,
  getAllTreatmentTypes
};

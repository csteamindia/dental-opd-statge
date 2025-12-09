/* eslint-disable max-len */
/**
 * Reference Type controller
 *
 * @author Your Name
 */
import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';

import {
  createReferenceTypeService,
  getAllReferenceTypesService,
  getReferenceTypeByIdService,
  updateReferenceTypeService,
  deleteReferenceTypeService
} from '../services/ReferenceTypes.service.js';

const responseHandler = response.default;

// Create new Reference Type
const createReferenceType = async (req, res) => {
  try {
    const data = await createReferenceTypeService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all Reference Types
const getAllReferenceTypes = async (req, res) => {
  try {
    const data = await getAllReferenceTypesService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get Reference Type by ID

const getReferenceTypeById = async (req, res) => {
  try {
    const data = await getReferenceTypeByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Reference type not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false));
  }
};


// Update Reference Type
const updateReferenceType = async (req, res) => {
  try {
    const data = await updateReferenceTypeService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete Reference Type (soft delete)
const deleteReferenceType = async (req, res) => {
  try {
    const data = await deleteReferenceTypeService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createReferenceType,
  getAllReferenceTypes,
  getReferenceTypeById,
  updateReferenceType,
  deleteReferenceType
};


/* eslint-disable max-len */
/**
 * Permission controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createPermissionService,
  getAllPermissionsService,
  getPermissionByIdService,
  updatePermissionService,
  deletePermissionService
} from '../services/Permissions.service.js';

const responseHandler = response.default;

// Create new Permission
const createPermission = async (req, res) => {
  try {
    const data = await createPermissionService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all Permissions
const getAllPermissions = async (req, res) => {
  try {
    const data = await getAllPermissionsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get Permission by ID
const getPermissionById = async (req, res) => {
  try {
    const data = await getPermissionByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Permission not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false));
  }
};


// Update Permission
const updatePermission = async (req, res) => {
  try {
    const data = await updatePermissionService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete Permission
const deletePermission = async (req, res) => {
  try {
    const data = await deletePermissionService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission
};

/* eslint-disable max-len */
/**
 * Role controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService,
  deleteRoleService
} from '../services/Roles.service.js';

const responseHandler = response.default;

// Create new Role
const createRole = async (req, res) => {
  try {
    const data = await createRoleService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all Roles
const getAllRoles = async (req, res) => {
  try {
    const data = await getAllRolesService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get Role by ID
const getRoleById = async (req, res) => {
  try {
    const data = await getRoleByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Role not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler([], false));
  }
};


// Update Role
const updateRole = async (req, res) => {
  try {
    const data = await updateRoleService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete Role
const deleteRole = async (req, res) => {
  try {
    const data = await deleteRoleService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
};

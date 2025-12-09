/* eslint-disable max-len */
/**
 * files controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import {
  createFileService,
  getAllFilesService,
  getFileByIdService,
  updateFileService,
  deleteFileService
} from '../services/Files.service.js';
const responseHandler = response.default;

// Create new file
const createFile = async (req, res) => {
  try { 
    const data = await createFileService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all files
const getAllFiles = async (req, res) => {
  try {
    const data = await getAllFilesService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get file by ID
const getFileById = async (req, res) => {
  try {
    const data = await getFileByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "File not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};

// Update file
const updateFile = async (req, res) => {
  try {
    const data = await updateFileService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const data = await deleteFileService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createFile,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile
};

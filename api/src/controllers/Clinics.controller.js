/* eslint-disable max-len */
/**
 * clinic controller
 *
 * @author [Your Name]
 */
import httpStatus from "http-status";

import * as response from "../middlewares/response-handler.js";
import {
  createClinicService,
  getAllClinicsService,
  getClinicByIdService,
  updateClinicService,
  deleteClinicService,
} from "../services/Clinics.service.js";

const responseHandler = response.default;

// Create new clinic
const createClinic = async (req, res) => {
  try {
    const data = await createClinicService(req);
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all clinics
const getAllClinics = async (req, res) => {
  try {
    console.log("asd");
    const data = await getAllClinicsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get clinic by ID
const getClinicById = async (req, res) => {
  try {
    const data = await getClinicByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Clinic not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

// Update clinic
const updateClinic = async (req, res) => {
  try {
    const data = await updateClinicService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Clinic not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "Clinic updated successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

// Delete clinic
const deleteClinic = async (req, res) => {
  try {
    const data = await deleteClinicService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Clinic not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "Clinic deleted successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

// Default clinic
const defaultClinic = async (req, res) => {
  try {
    const data = await defaultClinicService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

//Upload clinic image
const clinicImageUpload = async (req, res) => {
  try {
    const data = await clinicImageUploadService(req);
    if (data.errors) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createClinic,
  getAllClinics,
  getClinicById,
  updateClinic,
  deleteClinic,
  defaultClinic,
  clinicImageUpload
};

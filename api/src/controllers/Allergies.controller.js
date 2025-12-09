/* eslint-disable max-len */
/**
 * location controller
 *
 * @author Praveenumar Yennam
 */
import httpStatus from "http-status";

import * as response from "../middlewares/response-handler.js";
import {
  createAllergyService,
  getAllAllergiesService,
  getAllergyByIdService,
  updateAllergyService,
  deleteAllergyService,
} from "../services/Allergies.service.js";

const responseHandler = response.default;

const createAllergy = async (req, res) => {
  try {
    const data = await createAllergyService(req);
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

const getAllAllergies = async (req, res) => {
  try {
    const data = await getAllAllergiesService(req);
    console.log("------------------>", data);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const getAllergyById = async (req, res) => {
  try {
    const data = await getAllergyByIdService(req);

    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler([], false, "Allergy not found"));
    }

    return res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message));
  }
};

const updateAllergy = async (req, res) => {
  try {
    const data = await updateAllergyService(req);
    if (data[0] === 0) {
      return res
        .status(httpStatus.NOT_IMPLEMENTED)
        .send(responseHandler(null, false, "Allergy not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message));
  }
};

const deleteAllergy = async (req, res) => {
  try {
    const data = await deleteAllergyService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Allergy not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "Allergy deleted successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message));
  }
};
export {
  createAllergy,
  getAllAllergies,
  getAllergyById,
  updateAllergy,
  deleteAllergy,
};

import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createPatient_Follow_UpService,
  getAllPatient_Follow_UpService,
  getPatient_Follow_UpByIdService,
  deletePatient_Follow_UpService,
} from "../services/Patient_Follow_Up.service.js";

const responseHandler = response.default;

const createPatient_Follow_Up = async (req, res) => {
  try {
    const data = await createPatient_Follow_UpService(req);
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

const getAllPatient_Follow_Up = async (req, res) => {
  try {
    const data = await getAllPatient_Follow_UpService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const getPatient_Follow_UpById = async (req, res) => {
  try {
    const data = await getPatient_Follow_UpByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Patient_Follow_Up not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const deletePatient_Follow_Up = async (req, res) => {
  try {
    const data = await deletePatient_Follow_UpService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Patient_Follow_Up not found"));
    }
    res
      .status(httpStatus.OK)
      .send(
        responseHandler(null, true, "Patient_Follow_Up deleted successfully")
      );
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

export {
  createPatient_Follow_Up,
  getAllPatient_Follow_Up,
  getPatient_Follow_UpById,
  deletePatient_Follow_Up,
};

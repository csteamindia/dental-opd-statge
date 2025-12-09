import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createRX_TemplatesService,
  getAllRX_TemplatesService,
  getRX_TemplatesByIdService,
  updateRX_TemplatesService,
  deleteRX_TemplatesService,
} from "../services/RX_TemplatesService.js";

const responseHandler = response.default;

const createRX_Templates = async (req, res) => {
  try {
    const data = await createRX_TemplatesService(req);
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

const getAllRX_Templates = async (req, res) => {
  try {
    const data = await getAllRX_TemplatesService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const getRX_TemplatesById = async (req, res) => {
  try {
    const data = await getRX_TemplatesByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "RX_Template not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const updateRX_Templates = async (req, res) => {
  try {
    const data = await updateRX_TemplatesService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "RX_Template not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "RX_Template updated successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const deleteRX_Templates = async (req, res) => {
  try {
    const data = await deleteRX_TemplatesService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "RX_Template not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "RX_Template deleted successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

export {
  createRX_Templates,
  getAllRX_Templates,
  getRX_TemplatesById,
  updateRX_Templates,
  deleteRX_Templates,
};

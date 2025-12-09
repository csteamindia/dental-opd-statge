import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createBankDepositesService,
  getAllBankDepositesService,
  getBankDepositesByIdService,
  updateBankDepositesService,
  deleteBankDepositesService,
} from "../services/BankDeposits.service.js";

const responseHandler = response.default;

const createBankDeposites = async (req, res) => {
  try {
    const data = await createBankDepositesService(req);
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

const getAllBankDeposites = async (req, res) => {
  try {
    const data = await getAllBankDepositesService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const getBankDepositesById = async (req, res) => {
  try {
    const data = await getBankDepositesByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "BankDeposite not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const updateBankDeposites = async (req, res) => {
  try {
    const data = await updateBankDepositesService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "BankDeposite not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "BankDeposite updated successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const deleteBankDeposites = async (req, res) => {
  try {
    const data = await deleteBankDepositesService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "BankDeposite not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "BankDeposite deleted successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

export {
  createBankDeposites,
  getAllBankDeposites,
  getBankDepositesById,
  updateBankDeposites,
  deleteBankDeposites,
};

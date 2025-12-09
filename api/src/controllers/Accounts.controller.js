import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createVoucherService,
  getAllVoucherService,
  getVoucherByIdService,
  updateAccountsService,
  deleteAccountsService,
  createBillingService,
  getAllBillsService,
  cancelBillingService
} from "../services/Accounts.service.js";

const responseHandler = response.default;

const createVoucher = async (req, res) => {
  try {
    const data = await createVoucherService(req);
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

const getAllVouchers = async (req, res) => {
  try {
    const data = await getAllVoucherService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Billings

const createBilling = async (req, res) => {
  try {
    const data = await createBillingService(req);
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

const getAllBills = async (req, res) => {
  try {
    const data = await getAllBillsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const getVoucherById = async (req, res) => {
  try {
    const data = await getVoucherByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Accounts not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const updateAccounts = async (req, res) => {
  try {
    const data = await updateAccountsService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Accounts not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "Accounts updated successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const deleteAccounts = async (req, res) => {
  try {
    const data = await deleteAccountsService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Accounts not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "Accounts deleted successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const cancelBilling = async (req, res) => {
  try {
    const data = await cancelBillingService(req);
    console.log(data);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Bill not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "Bill Canceled successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

export {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateAccounts,
  deleteAccounts,
  createBilling,
  getAllBills,
  cancelBilling
};

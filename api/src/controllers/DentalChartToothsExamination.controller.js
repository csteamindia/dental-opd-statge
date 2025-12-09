import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createDentalChartToothsExaminationService,
  getAllDentalChartToothsExaminationService,
  getDentalChartToothsExaminationByIdService,
  updateDentalChartToothsExaminationService,
  deleteDentalChartToothsExaminationService,
  getAllDentalChartToothsExaminationOptionsService,
} from "../services/DentalChartToothsExamination.service.js";

const responseHandler = response.default;

const createDentalChartToothsExamination = async (req, res) => {
  try {
    const data = await createDentalChartToothsExaminationService(req);
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

const getAllDentalChartToothsExaminationOptions = async (req, res) => {
  try {
    const data = await getAllDentalChartToothsExaminationOptionsService(req);
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

const getAllDentalChartToothsExamination = async (req, res) => {
  try {
    const data = await getAllDentalChartToothsExaminationService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const getDentalChartToothsExaminationById = async (req, res) => {
  try {
    const data = await getDentalChartToothsExaminationByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(
          responseHandler(
            null,
            false,
            "DentalChartToothsExaminations not found"
          )
        );
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const updateDentalChartToothsExamination = async (req, res) => {
  try {
    const data = await updateDentalChartToothsExaminationService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(
          responseHandler(
            null,
            false,
            "DentalChartToothsExaminations not found"
          )
        );
    }
    res
      .status(httpStatus.OK)
      .send(
        responseHandler(
          null,
          true,
          "DentalChartToothsExaminations updated successfully"
        )
      );
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const deleteDentalChartToothsExamination = async (req, res) => {
  try {
    const data = await deleteDentalChartToothsExaminationService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(
          responseHandler(
            null,
            false,
            "DentalChartToothsExaminations not found"
          )
        );
    }
    res
      .status(httpStatus.OK)
      .send(
        responseHandler(
          null,
          true,
          "DentalChartToothsExaminations deleted successfully"
        )
      );
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

export {
  createDentalChartToothsExamination,
  getAllDentalChartToothsExamination,
  getDentalChartToothsExaminationById,
  updateDentalChartToothsExamination,
  deleteDentalChartToothsExamination,
  getAllDentalChartToothsExaminationOptions
};
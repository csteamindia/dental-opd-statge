import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createDental_Chart_ExaminationsService,
  getAllDental_Chart_ExaminationsService,
  getDental_Chart_ExaminationsByIdService,
  updateDental_Chart_ExaminationsService,
  deleteDental_Chart_ExaminationsService,
  createPeriodicalChartService,
  getPeriodicalChartService,
  updatePeriodicalChartService,
  deletePeriodicalChartService,
} from "../services/Dentalchart.service.js";
 
const responseHandler = response.default;
 
const createDental_Chart_Examinations = async (req, res) => {
  try {
    const data = await createDental_Chart_ExaminationsService(req);
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
 
const getAllDental_Chart_Examinations = async (req, res) => {
  try {
    const data = await getAllDental_Chart_ExaminationsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};
 
const getDental_Chart_ExaminationsById = async (req, res) => {
  try {
    const data = await getDental_Chart_ExaminationsByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(
          responseHandler(null, false, "Dental_Chart_Examination not found")
        );
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};
 
const updateDental_Chart_Examinations = async (req, res) => {
  try {
    const data = await updateDental_Chart_ExaminationsService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(
          responseHandler(null, false, "Dental_Chart_Examination not found")
        );
    }
    res
      .status(httpStatus.OK)
      .send(
        responseHandler(
          null,
          true,
          "Dental_Chart_Examination updated successfully"
        )
      );
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};
 
const deleteDental_Chart_Examinations = async (req, res) => {
  try {
    const data = await deleteDental_Chart_ExaminationsService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(
          responseHandler(null, false, "Dental_Chart_Examination not found")
        );
    }
    res
      .status(httpStatus.OK)
      .send(
        responseHandler(
          null,
          true,
          "Dental_Chart_Examination deleted successfully"
        )
      );
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};


// ===================================Periodical chart functions ==================
// Create new periodical chart
const createPeriodicalChart = async (req, res) => {
  try {
    const data = await createPeriodicalChartService(req);
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

const getPeriodicalChart = async (req, res) => {
  try {
    const data = await getPeriodicalChartService(req);
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
 
// Update periodical chart
const updatePeriodicalChart = async (req, res) => {
  try {
    const data = await updatePeriodicalChartService(req);
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
 
// Delete periodical chart
const deletePeriodicalChart = async (req, res) => {
  try {
    const data = await deletePeriodicalChartService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};
 
export {
  createDental_Chart_Examinations,
  getAllDental_Chart_Examinations,
  getDental_Chart_ExaminationsById,
  updateDental_Chart_Examinations,
  deleteDental_Chart_Examinations,
  createPeriodicalChart,
  getPeriodicalChart,
  updatePeriodicalChart,
  deletePeriodicalChart,
};
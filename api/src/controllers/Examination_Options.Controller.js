import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createExamination_OptionsService,
  getAllExamination_OptionsService,
} from "../services/Examination_Options.Service.js";

const responseHandler = response.default;

const createExamination_Options = async (req, res) => {
  try {
    const data = await createExamination_OptionsService(req);
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

const getAllExamination_Options = async (req, res) => {
  try {
    const data = await getAllExamination_OptionsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export { createExamination_Options, getAllExamination_Options };

import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import { getAllExamination_TypesService } from "../services/Examination_Types.service.js";

const responseHandler = response.default;

export const getAllExamination_Types = async (req, res) => {
  try {
    const data = await getAllExamination_TypesService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

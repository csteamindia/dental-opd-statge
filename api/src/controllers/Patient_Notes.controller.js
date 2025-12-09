import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import {
  createPatient_NotesService,
  getAllPatient_NotesService,
  getPatient_NotesByIdService,
  deletePatient_NotesService,
} from "../services/Patient_Notes.service.js";

const responseHandler = response.default;

const createPatient_Notes = async (req, res) => {
  try {
    const data = await createPatient_NotesService(req);
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

const getAllPatient_Notes = async (req, res) => {
  try {
    const data = await getAllPatient_NotesService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const getPatient_NotesById = async (req, res) => {
  try {
    const data = await getPatient_NotesByIdService(req);
    if (!data) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Patient_Notes not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

const deletePatient_Notes = async (req, res) => {
  try {
    const data = await deletePatient_NotesService(req);
    if (!data[0]) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send(responseHandler(null, false, "Patient_Notes not found"));
    }
    res
      .status(httpStatus.OK)
      .send(responseHandler(null, true, "Patient_Notes deleted successfully"));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler(null, false, e.message));
  }
};

export {
  createPatient_Notes,
  getAllPatient_Notes,
  getPatient_NotesById,
  deletePatient_Notes,
};

import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
    createDoctorTimingsService,
    getAllDoctorTimingsService,
    getDoctorTimingsByIdService,
    updateDoctorTimingsService,
    deleteDoctorTimingsService
} from '../services/DoctorTimings.service.js';

const responseHandler = response.default;

const createDoctorTimings = async (req, res) => {
    try {
        const data = await createDoctorTimingsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllDoctorTimings = async (req, res) => {
    try {
        const data = await getAllDoctorTimingsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getDoctorTimingsById = async (req, res) => {
  try {
    const data = await getDoctorTimingsByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Doctor timings not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};


const updateDoctorTimings = async (req, res) => {
    try {
        const data = await updateDoctorTimingsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const deleteDoctorTimings = async (req, res) => {
    try {
        const data = await deleteDoctorTimingsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

export {
    createDoctorTimings,
    getAllDoctorTimings,
    getDoctorTimingsById,
    updateDoctorTimings,
    deleteDoctorTimings
};

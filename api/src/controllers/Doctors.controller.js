import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
    createDoctorsService,
    getAllDoctorsService,
    getDoctorsByIdService,
    updateDoctorsService,
    deleteDoctorsService,
    doctorsOptionsService
} from '../services/Doctors.service.js';

const responseHandler = response.default;

const createDoctors = async (req, res) => {
    try {
        const data = await createDoctorsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const data = await getAllDoctorsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getDoctorsById = async (req, res) => {
  try {
    const data = await getDoctorsByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Doctor not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};

const updateDoctors = async (req, res) => {
    try {
        const data = await updateDoctorsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const deleteDoctors = async (req, res) => {
    try {
        const data = await deleteDoctorsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getDoctorsOptions = async (req, res) => {
    try {
        const data = await doctorsOptionsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

export {
    createDoctors,
    getAllDoctors,
    getDoctorsById,
    updateDoctors,
    deleteDoctors,
    getDoctorsOptions
};

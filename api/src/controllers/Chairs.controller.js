import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
    createChairsService,
    getAllChairsService,
    getChairsByIdService,
    updateChairsService,
    deleteChairsService
} from '../services/Chairs.service.js';

const responseHandler = response.default;

const createChairs = async (req, res) => {
    try {
        const data = await createChairsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllChairs = async (req, res) => {
    try {
        const data = await getAllChairsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getChairsById = async (req, res) => {
    try {
        const data = await getChairsByIdService(req);
        if (!data) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Chair not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
    }
};

const updateChairs = async (req, res) => {
    try {
        const data = await updateChairsService(req);
        if (!data[0]) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Chair not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(null, true, "Chair updated successfully"));
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
    }
};

const deleteChairs = async (req, res) => {
    try {
        const data = await deleteChairsService(req);
        if (!data[0]) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Chair not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(null, true, "Chair deleted successfully"));
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
    }
};

export {
    createChairs,
    getAllChairs,
    getChairsById,
    updateChairs,
    deleteChairs
};

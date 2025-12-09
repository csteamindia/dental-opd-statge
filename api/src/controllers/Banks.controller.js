import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import { 
    createBanksService,
    getAllBanksService,
    getBanksByIdService,
    updateBanksService,
    deleteBanksService
} from '../services/Banks.service.js';

const responseHandler = response.default;

const createBanks = async (req, res) => {
    try {
        const data = await createBanksService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllBanks = async (req, res) => {
    try {
        const data = await getAllBanksService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getBanksById = async (req, res) => {
    try {
        const data = await getBanksByIdService(req);
        if (!data) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Bank not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
    }
};

const updateBanks = async (req, res) => {
    try {
        const data = await updateBanksService(req);
        if (!data[0]) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Bank not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(null, true, "Bank updated successfully"));
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
    }
};

const deleteBanks = async (req, res) => {
    try {
        const data = await deleteBanksService(req);
        if (!data[0]) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Bank not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(null, true, "Bank deleted successfully"));
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
    }
};

export {
    createBanks,
    getAllBanks,
    getBanksById,
    updateBanks,
    deleteBanks
};

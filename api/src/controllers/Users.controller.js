/* eslint-disable max-len */
import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
    createUserService,
    getAllUserService,
    getUsersByIdService,
    updateUsersService,
    deleteUsersService
} from '../services/Users.service.js';

const responseHandler = response.default;

const createUser = async (req, res) => {
    try {
        const data = await createUserService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllUsers = async (req, res) => {
    try {
        const data = await getAllUserService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getUsersById = async (req, res) => {
    try {
        const data = await getUsersByIdService(req);
        if (!data) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, " tags not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
    }
};


const updateUsers = async (req, res) => {
    try {
        const data = await updateUsersService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const deleteUsers = async (req, res) => {
    try {
        const data = await deleteUsersService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

export {
    createUser,
    getAllUsers,
    getUsersById,
    updateUsers,
    deleteUsers
};

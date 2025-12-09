/* eslint-disable max-len */
import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
    createLanguageService,
    getAllLanguagesService,
    getLanguageByIdService,
    updateLanguageService,
    deleteLanguageService
} from '../services/language.service.js';

const responseHandler = response.default;

const createLanguage = async (req, res) => {
    try {
        const data = await createLanguageService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllLanguages = async (req, res) => {
    try {
        const data = await getAllLanguagesService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getLanguageById = async (req, res) => {
    try {
        const data = await getLanguageByIdService(req);
        if (!data) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, " tags not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
    }
};


const updateLanguage = async (req, res) => {
    try {
        const data = await updateLanguageService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const deleteLanguage = async (req, res) => {
    try {
        const data = await deleteLanguageService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

export { createLanguage, getAllLanguages, getLanguageById, updateLanguage, deleteLanguage  };

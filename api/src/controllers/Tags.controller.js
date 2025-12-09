import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
    createTagsService,
    getAllTagsService,
    getTagsByIdService,
    updateTagsService,
    deleteTagsService
} from '../services/Tags.service.js';

const responseHandler = response.default;

const createTags = async (req, res) => {
    try {
        const data = await createTagsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllTags = async (req, res) => {
    try {
        const data = await getAllTagsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getTagsById = async (req, res) => {
    try {
        const data = await getTagsByIdService(req);
        if (!data) {
            return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, " tags not found"));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
    }
};


const updateTags = async (req, res) => {
    try {
        const data = await updateTagsService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const deleteTags = async (req, res) => {
    try {
        const data = await deleteTagsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

export {
    createTags,
    getAllTags,
    getTagsById,
    updateTags,
    deleteTags
};

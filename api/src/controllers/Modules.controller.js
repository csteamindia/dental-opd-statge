import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
    createModulesService,
    getAllModulesService
} from '../services/Modules.service.js';

const responseHandler = response.default;

const createModules = async (req, res) => {
    try {
        const data = await createModulesService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

const getAllModules = async (req, res) => {
    try {
        const data = await getAllModulesService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

export {
    createModules,
    getAllModules
};





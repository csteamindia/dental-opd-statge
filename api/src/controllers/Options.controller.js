/* eslint-disable max-len */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import { dynamicOptionsService, dynamicPatientOptionsService } from '../services/Options.service.js';

const responseHandler = response.default;

//Upload clinic image
const dynamicOptions = async (req, res) => {
  try {
    const data = await dynamicOptionsService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

const dynamicPatientOptions = async (req, res) => {
  try {
    const data = await dynamicPatientOptionsService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export { dynamicOptions, dynamicPatientOptions };

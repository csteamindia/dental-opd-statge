import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import { 
    createCommunicationGroupService,
    getAllCommunicationGroupsService,
    getCommunicationGroupByIdService,
    updateCommunicationGroupService,
    deleteCommunicationGroupService
} from '../services/CommunicationGroup.service.js';

const responseHandler = response.default;

// Create new communication group
const createCommunicationGroup = async (req, res) => {
    try {
        const data = await createCommunicationGroupService(req);
        if (data.errors) {
            return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
        }
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

// Get all communication groups
const getAllCommunicationGroups = async (req, res) => {
    try {
        const data = await getAllCommunicationGroupsService(req);
        res.status(httpStatus.OK).send(responseHandler(data));
    } catch (e) {
        res.status(httpStatus.OK).send(responseHandler([], false));
    }
};

// Get communication group by ID
const getCommunicationGroupById = async (req, res) => {
  try {
    const data = await getCommunicationGroupByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Communication group not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
  }
};

// Update communication group
const updateCommunicationGroup = async (req, res) => {
  try {
    const data = await updateCommunicationGroupService(req);
    if (!data[0]) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Communication group not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(null, true, "Communication group updated successfully"));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
  }
};

// Delete communication group
const deleteCommunicationGroup = async (req, res) => {
  try {
    const data = await deleteCommunicationGroupService(req);
    if (!data[0]) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Communication group not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(null, true, "Communication group deleted successfully"));
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, e.message));
  }
};


export {
    createCommunicationGroup,
    getAllCommunicationGroups,
    getCommunicationGroupById,
    updateCommunicationGroup,
    deleteCommunicationGroup
};

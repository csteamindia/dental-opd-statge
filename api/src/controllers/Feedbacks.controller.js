/* eslint-disable max-len */
/**
 * Feedback controller
 *
 * @author Your Name
 */
import httpStatus from 'http-status';

import * as response from '../middlewares/response-handler.js';
import { createFeedbackService, getAllFeedbacksService, getFeedbackByIdService, updateFeedbackService, deleteFeedbackService } from '../services/Feedbacks.service.js';

const responseHandler = response.default;

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const data = await createFeedbackService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get all feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const data = await getAllFeedbacksService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const data = await getFeedbackByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler(null, false, "Feedback not found"));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler(null, false, error.message));
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const data = await updateFeedbackService(req);
    if (data.errors) {
      return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const data = await deleteFeedbackService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (e) {
    res.status(httpStatus.OK).send(responseHandler([], false));
  }
};

export {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
};

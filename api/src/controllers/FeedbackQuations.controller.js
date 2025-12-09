// /* eslint-disable max-len */
// /**
//  * feedback questions controller
//  *
//  * @author Praveenumar Yennam
//  */
// import httpStatus from 'http-status';

// import * as response from '../middlewares/response-handler.js';
// import { createFeedbackQuestionService, getAllFeedbackQuestionsService, getFeedbackQuestionByIdService, updateFeedbackQuestionService, deleteFeedbackQuestionService } from '../services/FeedbackQuations.service.js';

// const responseHandler = response.default;

// // Create new feedback question
// const createFeedbackQuestion = async (req, res) => {
//   try {
//     const data = await createFeedbackQuestionService(req);
//     if (data.errors) {
//       return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
//     }
//     res.status(httpStatus.OK).send(responseHandler(data));
//   } catch (e) {
//     res.status(httpStatus.OK).send(responseHandler([], false));
//   }
// };

// // Get all feedback questions
// const getAllFeedbackQuestions = async (req, res) => {
//   try {
//     const data = await getAllFeedbackQuestionsService(req);
//     res.status(httpStatus.OK).send(responseHandler(data));
//   } catch (e) {
//     res.status(httpStatus.OK).send(responseHandler([], false));
//   }
// };

// // Get feedback question by ID
// const getFeedbackQuestionById = async (req, res) => {
//   try {
//     const data = await getFeedbackQuestionByIdService(req);
//     res.status(httpStatus.OK).send(responseHandler(data));
//   } catch (e) {
//     res.status(httpStatus.OK).send(responseHandler([], false));
//   }
// };

// // Update feedback question
// const updateFeedbackQuestion = async (req, res) => {
//   try {
//     const data = await updateFeedbackQuestionService(req);
//     if (data.errors) {
//       return res.status(httpStatus.NOT_IMPLEMENTED).send(responseHandler(data.errors[0].message, false));
//     }
//     res.status(httpStatus.OK).send(responseHandler(data));
//   } catch (e) {
//     res.status(httpStatus.OK).send(responseHandler([], false));
//   }
// };

// // Delete feedback question (soft delete)
// const deleteFeedbackQuestion = async (req, res) => {
//   try {
//     const data = await deleteFeedbackQuestionService(req);
//     res.status(httpStatus.OK).send(responseHandler(data));
//   } catch (e) {
//     res.status(httpStatus.OK).send(responseHandler([], false));
//   }
// };

// export {
//   createFeedbackQuestion,
//   getAllFeedbackQuestions,
//   getFeedbackQuestionById,
//   updateFeedbackQuestion,
//   deleteFeedbackQuestion
// };



/* eslint-disable max-len */
/**
 * feedback questions controller
 *
 * @author Praveenumar Yennam
 */

import httpStatus from 'http-status';
import * as response from '../middlewares/response-handler.js';
import {
  createFeedbackQuestionService,
  getAllFeedbackQuestionsService,
  getFeedbackQuestionByIdService,
  updateFeedbackQuestionService,
  deleteFeedbackQuestionService
} from '../services/FeedbackQuations.service.js';

const responseHandler = response.default;

// Create new feedback question
const createFeedbackQuestion = async (req, res) => {
  try {
    const data = await createFeedbackQuestionService(req);
    res.status(httpStatus.CREATED).send(responseHandler(data));
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler('Failed to create feedback question', false));
  }
};

// Get all feedback questions
const getAllFeedbackQuestions = async (req, res) => {
  try {
    const data = await getAllFeedbackQuestionsService(req);
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler('Failed to retrieve feedback questions', false));
  }
};

// Get feedback question by ID
const getFeedbackQuestionById = async (req, res) => {
  try {
    const data = await getFeedbackQuestionByIdService(req);
    if (!data) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler('Feedback question not found', false));
    }
    res.status(httpStatus.OK).send(responseHandler(data));
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler('Failed to retrieve feedback question', false));
  }
};

// Update feedback question
const updateFeedbackQuestion = async (req, res) => {
  try {
    const result = await updateFeedbackQuestionService(req);
    if (result[0] === 0) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler('Feedback question not found or not updated', false));
    }
    res.status(httpStatus.OK).send(responseHandler('Feedback question updated successfully'));
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler('Failed to update feedback question', false));
  }
};

// Delete feedback question (soft delete)
const deleteFeedbackQuestion = async (req, res) => {
  try {
    const result = await deleteFeedbackQuestionService(req);
    if (result[0] === 0) {
      return res.status(httpStatus.NOT_FOUND).send(responseHandler('Feedback question not found or already deleted', false));
    }
    res.status(httpStatus.OK).send(responseHandler('Feedback question deleted successfully'));
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseHandler('Failed to delete feedback question', false));
  }
};

export {
  createFeedbackQuestion,
  getAllFeedbackQuestions,
  getFeedbackQuestionById,
  updateFeedbackQuestion,
  deleteFeedbackQuestion
};

import db from '../models/index.js';
const { FeedbackQuations, Clinics, User } = db;

// Create new feedback question
const createFeedbackQuestionService = async (req) => {
  try {
    const { body } = req;
    const result = await FeedbackQuations.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all feedback questions
const getAllFeedbackQuestionsService = async (req) => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = { status: 0 };
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;

    const condition = {
      where,
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: Clinics,
          as: 'clinic',
          required: true,
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
        {
          model: User,
          as: 'client',
          required: false,
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
      ],
      order: [['id', 'DESC']],
    };
    if (query?.client_id) {
      condition.where = [{
        client_id: query?.client_id
      }]
    }
    if (query?.clinic_id) {
      condition.where = [{
        clinic_id: query?.clinic_id
      }]
    }

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await FeedbackQuations.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};


// Get single feedback question by ID
const getFeedbackQuestionByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await FeedbackQuations.findOne({
      where: {
        id,
        status: 0
      },
      attributes: { exclude: ['created_at', 'updated_at'] },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update feedback question
const updateFeedbackQuestionService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const [updated] = await FeedbackQuations.update(body, {
      where: {
        id,
        status: 0
      }
    });
    if (!updated) return null;
    return await FeedbackQuations.findByPk(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete feedback question (soft delete)
const deleteFeedbackQuestionService = async (req) => {
  try {
    const { id } = req.params;
    const {sts}=req.query
    const [deleted] = await FeedbackQuations.update(
      { status:sts},
      { where: { id } }
    );
    return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  createFeedbackQuestionService,
  getAllFeedbackQuestionsService,
  getFeedbackQuestionByIdService,
  updateFeedbackQuestionService,
  deleteFeedbackQuestionService
};

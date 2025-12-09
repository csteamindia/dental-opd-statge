import db from "../models/index.js";
import "dotenv/config";
const { CommunicationGroup, Clinics, User, Sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from "../utils/Basicutils.js";

const createCommunicationGroupService = async (req) => {
  const { body } = req;
  try {
    const res = await CommunicationGroup.create(body);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllCommunicationGroupsService = async (req) => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};

    if (clinic_id) {
      where.clinic_id = {
        [Sequelize.Op.or]: [null, clinic_id]
      }
    }

    if (client_id) {
      where.client_id = {
        [Sequelize.Op.or]: [null, client_id]
      };
    }

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Clinics,
          as: "clinic",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: User,
          as: "client",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      order: [["id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await CommunicationGroup.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all communication groups:", e.message);
    return { success: false, message: e.message };
  }
};

const getCommunicationGroupByIdService = async (req) => {
  try {
    const { id } = req.params;
    const res = await CommunicationGroup.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const updateCommunicationGroupService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const res = await CommunicationGroup.update(body, {
      where: {
        id,
        status: 0,
      },
    });
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const deleteCommunicationGroupService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await CommunicationGroup.update(
      { status: sts },
      {
        where: { id },
      }
    );
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export {
  createCommunicationGroupService,
  getAllCommunicationGroupsService,
  getCommunicationGroupByIdService,
  updateCommunicationGroupService,
  deleteCommunicationGroupService,
};

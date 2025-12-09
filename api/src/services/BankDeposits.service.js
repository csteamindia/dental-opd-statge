import db from "../models/index.js";
import "dotenv/config";
const { Bank_Deposits, Clinics, User, sequelize, Banks } = db;
// console.log("BankDeposites", Bank_Deposits, Banks);

const createBankDepositesService = async (req) => {
  const { body } = req;
  try {
    const res = await Bank_Deposits.create(body);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllBankDepositesService = async (req) => {
  try {
    const {
      clinic_id,
      client_id,
      bank_id,
      page = 1,
      limit = 10,
      query,
    } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = { status: 0 };
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (bank_id) where.bank_id = bank_id;

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Banks,
          as: "bank",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Clinics,
          as: "clinic",
          required: true,
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
    if (query?.client_id) {
      condition.where = [
        {
          client_id: query?.client_id,
        },
      ];
    }
    if (query?.clinic_id) {
      condition.where = [
        {
          clinic_id: query?.clinic_id,
        },
      ];
    }
    if (query?.bank_id) {
      condition.where = [
        {
          bank_id: query?.bank_id,
        },
      ];
    }

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Bank_Deposits.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all BankDeposites:", e.message);
    return { success: false, message: e.message };
  }
};

const getBankDepositesByIdService = async (req) => {
  try {
    const { id } = req.params;
    const res = await Bank_Deposits.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const updateBankDepositesService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const res = await Bank_Deposits.update(body, {
      where: {
        id,
        status: 0,
      },
    });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const deleteBankDepositesService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await Bank_Deposits.update({ status: sts }, { where: { id } });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export {
  createBankDepositesService,
  getAllBankDepositesService,
  getBankDepositesByIdService,
  updateBankDepositesService,
  deleteBankDepositesService,
};

/* eslint-disable max-len */
import db from "../models/index.js";
import "dotenv/config";
const { Patients, Billing, Tretment, Vouchers, Clinics, User, Voucher_Transactions, sequelize } = db;
import moment from "moment";

const GenrateTrasectionId = async (type = 'VCH') => {
  const prifix = type;// == 1 ? "VCH": "PAY";

  const timestamp = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * 10000);
  return  `${prifix}/${timestamp}${randomNumber}`; 
}

const createVoucherService = async req => {
  const { body } = req;
  const transaction = await db.sequelize.transaction();
  
  try {
    // Validate required fields
    if (!body.voucherDate || !body.voucherType || !body.voucherEntries || !Array.isArray(body.voucherEntries)) {
      throw new Error('Missing required fields');
    }

    const t_id = await GenrateTrasectionId(body.voucherType == 1? 'VCH': 'PAY');

    const voucher = {
      datetime: body.voucherDate,
      receipt_type: body.voucherType,
      no_of_entries: body.voucherEntries.length,
      total_value: body.totalValue,
      transection_id: t_id,
      client_id: body.client_id,
      clinic_id: body.clinic_id,
      transection_description: body.voucherType == 1 ? "Cash_Recived" : "Cash_Paid",
    };

    const entries = body.voucherEntries.map((entry) => {
      if (!entry.amount || !entry.remark || !entry.type) {
        throw new Error('Invalid entry data');
      }
      return {
        voucher_id: t_id,
        amount: parseFloat(entry.amount),
        entity: entry.remark,
        description: entry.type,
        client_id: body.client_id,
        clinic_id: body.clinic_id,
      };
    });

    const createdVoucher = await Vouchers.create(voucher, { transaction });
    await Voucher_Transactions.bulkCreate(entries, { transaction });

    // Commit transaction
    await transaction.commit();

    return {
      success: true,
      data: {
        ...createdVoucher.toJSON(),
        entries
      }
    };

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error('Voucher creation error:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to create voucher'
    };
  }
};

const getAllVoucherService = async req => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = { status: 0 };
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
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

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Vouchers.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all Vouchers:", e.message);
    return { success: false, message: e.message };
  }
};


// Billing Transactions
const createBillingService = async req => {
  const { body } = req;
  const transaction = await sequelize.transaction();
  
  try {
    const treat_id = body?._q;
    const getTreat = await Tretment.findOne({
      where: {
        id: treat_id
      },
      transaction
    });

    const t_id = await GenrateTrasectionId("INV");

    const treatInfo = [{
      _type: getTreat?.treatment_type,
      tooth: getTreat?.tooth,
      cost: getTreat?.treatment_cost,
      discount: getTreat?.treatment_discount,
      total: getTreat?.treatment_total_cost,
    }];

    const finalObj = {
      patient_id: getTreat?.patient_id,
      treatment_ids: treat_id,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      treatment_info: JSON.stringify(treatInfo),
      billing_no: t_id,
      clinic_id: body.clinic_id,
      pending: parseFloat(getTreat?.treatment_total_cost),
      client_id: body.client_id,
    }

    const billingResult = await Billing.create(finalObj, { transaction })
    if (billingResult) {
      const a = {
        billed_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        is_billed: 1
      }
      await Tretment.update(a, {
        where: {
          id: treat_id
        },
        transaction
      });
      
      await transaction.commit();

      return {
        success: true,
        data: finalObj
      };
    } else{
      await transaction.rollback();
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Voucher creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create voucher'
    };
  }
};

const getAllBillsService = async req => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, patient_id } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = { };
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (patient_id) where.patient_id = patient_id;

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
        include: [
        {
          model: Tretment,
          as: "treatment",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Patients,
          as: "patients",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        }
      ],
      order: [["id", "DESC"]],
    };

    // if (query?.client_id) {
    //   condition.where = [
    //     {
    //       client_id: query?.client_id,
    //     },
    //   ];
    // }

    // if (query?.patient_id) {
    //   condition.where = [
    //     {
    //       patient_id: query?.patient_id,
    //     },
    //   ];
    // }
    // if (query?.clinic_id) {
    //   condition.where = [
    //     {
    //       clinic_id: query?.clinic_id,
    //     },
    //   ];
    // }

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Billing.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all Vouchers:", e.message);
    return { success: false, message: e.message };
  }
};

// --------------------------------------

const getVoucherByIdService = async req => {
  try {
    const { id } = req.params;
    const res = await Vouchers.findOne({
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

const updateAccountsService = async req => {
  try {
    const { id } = req.params;
    const { body } = req;
    const res = await Vouchers.update(body, {
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

const deleteAccountsService = async req => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await Vouchers.update({ status: sts }, { where: { id } });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const cancelBillingService = async req => {
  try {
    const { id } = req.params;
    // const { sts } = req.query;
    const res = await Billing.update({ status: 3 }, { where: { id } });
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export {
  createVoucherService,
  getAllVoucherService,
  getVoucherByIdService,
  updateAccountsService,
  deleteAccountsService,
  createBillingService,
  getAllBillsService,
  cancelBillingService
};

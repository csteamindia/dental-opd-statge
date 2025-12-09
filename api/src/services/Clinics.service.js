/* eslint-disable max-len */
import db from "../models/index.js";
const { Clinics, User, Doctors, Sequelize } = db;
import crypto from "crypto";
import { getDocCodeByClientId } from "../utils/Basicutils.js";

// Create new clinic
const createClinicService = async req => {
  try {
    const { body, tokendata } = req;

    body.client_id = tokendata.user_id;
    body.kiosk_code = crypto.randomUUID();
    body.access_code = crypto.randomUUID();
    body.clinic_url = `https://909dental.oralstop.com/${body.kiosk_code}`;
    return await Clinics.create(body);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllClinicsService = async req => {
  try {
    const { tokendata, query: {_q, client_id, doctor_code, page = 1, limit = 10} } = req;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const docCode = !doctor_code ? await getDocCodeByClientId(client_id || tokendata?.user_id): doctor_code;
    
    const where = { status: 0 };
    const orConditions = [];

    if (client_id || _q) {
      orConditions.push({ client_id: client_id || _q });
    }

    if (docCode) {
      orConditions.push({ doctor_code: docCode });
    }

    if (orConditions.length > 0) {
      where[Sequelize.Op.or] = orConditions;
    }

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Doctors,
          as: "doctors",
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
      group: 'code',
      order: [["id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Clinics.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all chairs:", e.message);
    return { success: false, message: e.message };
  }
};

// Get single clinic by ID
const getClinicByIdService = async req => {
  try {
    const { params: {id}, query: {clinic_id} } = req;

    const result = await Clinics.findOne({
      where: {
        id: id || clinic_id,
        status: 0,
      },
      include: [
        {
          model: Doctors,
          as: "doctors",
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
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update clinic
const updateClinicService = async req => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Clinics.update(body, {
      where: {
        id,
        status: 0,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete clinic (soft delete)
const deleteClinicService = async req => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const result = await Clinics.update(
      { status: sts },
      {
        where: {
          id,
        },
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Default clinic (soft delete)
const defaultClinicService = async req => {
  try {
    const { _default, clinic_id, client_id } = req.query;

    await Clinics.update(
      { is_default: 0 },
      {
        where: {
          client_id,
        },
      }
    );

    const result = await Clinics.update(
      { is_default: _default },
      {
        where: {
          id: clinic_id,
          client_id,
        },
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export {
  createClinicService,
  getAllClinicsService,
  getClinicByIdService,
  updateClinicService,
  deleteClinicService,
  defaultClinicService,
};

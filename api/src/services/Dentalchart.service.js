/* eslint-disable max-len */
import db from "../models/index.js";
import "dotenv/config";
const { Periodicalchart, DentalChart, Clinics, User } = db;
 
const createDental_Chart_ExaminationsService = async (req) => {
  const { body } = req;
  try {

    let tData = [];

    Object.keys(body)?.map( a => {
        const v = body[a]; 
        if(typeof v == 'object'){
            tData.push({
                id: v.id || null, 
                doctor_id: v.doctor?.value || v.doctor,
                date: v.date,
                toothinfo: v.toothInfo,
                patient_id: v.patient_id,
                examination: v.examination,
                treatment: JSON.stringify(v.treatment),
                note: v.note,
                clinic_id: body?.clinic_id,
                client_id: body?.client_id
            })
        }
    })

    const fieldsToUpdate = [ 'treatment_type' ];

    const res = await DentalChart.bulkCreate(tData, { updateOnDuplicate: fieldsToUpdate });
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
};
 
const getAllDental_Chart_ExaminationsService = async (req) => {
  try {
    const { patient_id, clinic_id, client_id, page = 1, limit = 10, query } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;
 
    const where = { status: 0 };
    if (patient_id) where.patient_id = patient_id;
    // if (clinic_id) where.clinic_id = clinic_id;

 
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
    
    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }
 
    const result = await DentalChart.findAndCountAll(condition);
 
    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (e) {
    console.error("Error fetching all Dental_Chart_Examinations:", e.message);
    return { success: false, message: e.message };
  }
};
 
const getDental_Chart_ExaminationsByIdService = async (req) => {
  try {
    const { id } = req.params;
    const res = await DentalChart.findOne({
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
 
const updateDental_Chart_ExaminationsService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const res = await DentalChart.update(body, {
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
 
const deleteDental_Chart_ExaminationsService = async (req) => {
  try {
    const { id } = req.params;
    const { sts } = req.query;
    const res = await DentalChart.update(
      { status: sts },
      { where: { id } }
    );
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// ===============================Periodical Chart Services=========
 
const createPeriodicalChartService = async req => {
  try {
    const { body: {doctor_id, lower, upper, date, patient_id, client_id, clinic_id}, tokendata } = req;

    const f = {
      doctor_id: doctor_id?.value? doctor_id?.value: doctor_id,
      patient_id: patient_id,
      date: date,
      lower: JSON.stringify(lower),
      upper: JSON.stringify(upper),
      client_id: client_id ? client_id: tokendata?.client_id, 
      clinic_id :clinic_id? clinic_id : tokendata?.clinic_id
    }
 
    const result = await Periodicalchart.create(f);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
 
const getPeriodicalChartService = async (req) => {
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
      order: [["id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Periodicalchart.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
 
const updatePeriodicalChartService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await Periodicalchart.update(body, {
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
 
// Delete periodical chart (soft delete)
const deletePeriodicalChartService = async (req) => {
  try {
    const { id } = req.params;
    // const { sts } = req.query;
    const result = await Periodicalchart.update(
      { status: 1 },
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
 
export {
  createDental_Chart_ExaminationsService,
  getAllDental_Chart_ExaminationsService,
  getDental_Chart_ExaminationsByIdService,
  updateDental_Chart_ExaminationsService,
  deleteDental_Chart_ExaminationsService,
  createPeriodicalChartService,
  getPeriodicalChartService,
  updatePeriodicalChartService,
  deletePeriodicalChartService,
};
 
 
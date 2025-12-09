/* eslint-disable max-len */
import db from "../models/index.js";
const { Appointment, User, Clinics, Patients, Doctors, Sequelize } = db;
import { SendWpMessage } from "../controllers/Whatsapp.controller.js";
import moment from "moment";

const createAppointmentService = async (req) => {
  try {
    const { body } = req;

    let result;

    if (body.id) {
      // Update
      result = await Appointment.update(body, {
        where: { id: body.id },
        returning: true
      });

      const updated = result[1]?.[0]; // sequelize returns [count, rows]
      return { success: true, body: updated };
    } else {
      // Create
      result = await Appointment.create(body);
      return { success: true, body: result };
    }

  } catch (error) {
    console.error("Error creating/updating appointment:", error);
    return { success: false, body: [], error: error.message };
  }
};

const getAllAppointmentsService = async req => {
  try {
    const {
      clinic_id = null,
      client_id = null,
      patient_id,
      doctor_code,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (patient_id) where.patient_id = patient_id;
    if (doctor_code) where.doctor_code = doctor_code;

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Clinics,
          as: "clinic",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        }, {
          model: User,
          as: "client",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        }, {
          model: Patients,
          as: "patient",
          attributes: { exclude: ["created_at", "updated_at"] },
        }, {
          model: Doctors,
          as: "doctor",
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

    const result = await Appointment.findAndCountAll(condition);

    return {
      success: true,
      body: {
        totalItems: result.count,
        totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
        currentPage: parsedLimit ? parsedPage : 1,
        items: result.rows,
      },
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, body: [], error: error.message };
  }
};

const getAppointmentByIdService = async (req) => {
  try {
    const { id } = req.params;
    const result = await Appointment.findOne({
      where: {
        id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });

    if (!result) {
      return { success: false, body: null, message: "Appointment not found" };
    }

    return { success: true, body: result };
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    return { success: false, body: null, error: error.message };
  }
};

const updateAppointmentService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const [updated] = await Appointment.update(body, {
      where: {
        id,
        status: 0,
      },
    });

    if (!updated) {
      return {
        success: false,
        body: null,
        message: "Appointment not found or not updated",
      };
    }

    const updatedAppointment = await Appointment.findByPk(id);
    return { success: true, body: updatedAppointment };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, body: null, error: error.message };
  }
};

const deleteAppointmentService = async req => {
  try {
    const { id } = req.params;
    const { note } = req.query;

    const [deleted] = await Appointment.update(
      { canceled_at: new Date(), canceled_note: note, is_visited: 2 },
      { where: { id } }
    );

    if (!deleted) {
      return {
        success: false,
        body: null,
        message: "Appointment not found or already deleted",
      };
    }

    return { success: true, body: { id, status: 1 } };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, body: null, error: error.message };
  }
};

const cancelAppointmentService = async (req) => {
  try {
    const { body, query: { clinic_id } } = req;
    const id = body.id;
    const patient = JSON.parse(atob(body._z));
    body.canceled_by = body.client_id
    body.is_visited = 2

    delete body.id;
    delete body._z;
    delete body.doctor;
    delete body.client_id;
    delete body.clinic_id;

    const [deleted] = await Appointment.update(
      { ...body },
      { where: { id } }
    );

    if (!deleted) {
      return {
        success: false,
        body: null,
        message: "Appointment not found or already canceld",
      };
    } else {
      const obj = {
        name: patient?.name,
        mobile: patient?.mobile,
        email: patient?.email,
        doctor: patient?.doctor,
        appointment_date: moment(patient?.appointment_date).format('MMMM Do [at] hh:mm A'),
        clinic_id: clinic_id
      }
      SendWpMessage(obj, 'app_can');
    }

    return { success: true, body: { id, status: 1 } };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, body: null, error: error.message };
  }
};

const getTodoAppointmentsService = async (req) => {
  try {
    const { clinic_id, client_id, _date, flag } = req.query;
    const today = moment().format('YYYY-MM-DD');


    const where = {
      status: 0,
      ...(clinic_id && { clinic_id }),
      ...(client_id && { client_id }),
    };
    
    if (_date) {
      where.appointment_date = _date;
    } 
    
    if(flag == 'c'){
      where.appointment_date = {
        [Sequelize.Op.between]: [
          moment().startOf("day").toDate(),
          moment().endOf("day").toDate(),
        ],
      };
      where.is_visited = 0
    }
    
    const condition = {
      where,
      attributes: ["id", "tretment_code", "appointment_date", "patient_id", "is_visited", "notes", "canceled_at", "index_position", "chair_code"],
      include: [
        {
          attributes: ["id", "first_name", "last_name", "gender", "mobile", "title", "email", "case_no"],
          model: Patients,
          as: "patient",
        }, {
          attributes: ["id", "name", "mobile", "code"],
          model: Doctors,
          as: "doctor",
          required: false,
        },
      ],
      order: [["id", "DESC"]],
    };

    const res = await Appointment.findAll(condition);

    return JSON.parse(JSON.stringify(res));

  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    return { success: false, body: null, error: error.message };
  }
};

export {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  getTodoAppointmentsService,
  cancelAppointmentService
};

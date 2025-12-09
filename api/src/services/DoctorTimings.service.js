import db from '../models/index.js';
import 'dotenv/config';
const { DoctorTimings, Clinics, User, Doctors } = db;

const createDoctorTimingsService = async (req) => {
    const { body } = req;
    try {
        const res = await DoctorTimings.create(body);
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllDoctorTimingsService = async (req) => {
    try {
        const { clinic_id, client_id, doctor_code, page = 1, limit = 10, query } = req.query;
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
        const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

        const where = {};
        if (clinic_id) where.clinic_id = clinic_id;
        if (client_id) where.client_id = client_id;
        if (doctor_code) where.doctor_code = doctor_code;

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
                {
                    model: Doctors,
                    as: 'doctor',
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
        if (query?.doctor_code) {
            condition.where = [{
                doctor_code: query?.doctor_code
            }]
        }

        if (parsedLimit) {
            condition.limit = parsedLimit;
            condition.offset = offset;
        }

        const result = await DoctorTimings.findAndCountAll(condition);

        return {
            totalItems: result.count,
            totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
            currentPage: parsedPage,
            items: result.rows,
        };
    } catch (e) {
        console.error('Error fetching doctor timings:', e.message);
        return { success: false, message: e.message };
    }
};


const getDoctorTimingsByIdService = async (req) => {
    try {
        const { id } = req.params;
        const res = await DoctorTimings.findOne({
            where: {
                id,
                status: 0
            },
            attributes: { exclude: ['created_at', 'updated_at'] },
        });
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const updateDoctorTimingsService = async (req) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const res = await DoctorTimings.update(body, {
            where: {
                id,
                status: 0
            }
        });
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const deleteDoctorTimingsService = async (req) => {
    try {
        const { id } = req.params;
        const { sts } = req.query
        const res = await DoctorTimings.update(
            { status: sts },
            { where: { id } }
        );
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

export {
    createDoctorTimingsService,
    getAllDoctorTimingsService,
    getDoctorTimingsByIdService,
    updateDoctorTimingsService,
    deleteDoctorTimingsService
};

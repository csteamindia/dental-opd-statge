import db from '../models/index.js';
import 'dotenv/config';
const { Doctors, Clinics, User } = db;
import { newRegistrationService } from './Auth.service.js'


const createDoctorsService = async (req) => {
    const { body } = req;
    try {
        await newRegistrationService(req, true);
        const res = await Doctors.create(body);
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllDoctorsService = async (req) => {
    try {
        const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
        const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

        const where = {};
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

        const result = await Doctors.findAndCountAll(condition);

        return {
            totalItems: result.count,
            totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
            currentPage: parsedPage,
            items: result.rows,
        };
    } catch (e) {
        console.error('Error fetching all doctors:', e.message);
        return { success: false, message: e.message };
    }
};


const getDoctorsByIdService = async (req) => {
    try {
        const { id } = req.params;
        const res = await Doctors.findOne({
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

const updateDoctorsService = async (req) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const res = await Doctors.update(body, {
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

const deleteDoctorsService = async (req) => {
    try {
        const { id } = req.params;
        const { sts } = req.query
        const res = await Doctors.update(
            { status: sts },
            { where: { id } }
        );
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const doctorsOptionsService = async (req) => {
    try {
        const { clinic_id } = req.body;
        let res = await Doctors.findAll(
            {
                where: {
                    clinic_id: clinic_id,
                    status: 0
                },
                include: [
                    {
                        model: Clinics,
                        as: 'clinic',
                    },
                ],
            }
        );

        return JSON.parse(JSON.stringify(res)).map((item) => ({
            value: item.code,
            label: item.name,
            isSelected: item.clinic.doctor_name === item.code,
        }));

    } catch (e) {
        console.log(e);
        return e;
    }
};


export {
    createDoctorsService,
    getAllDoctorsService,
    getDoctorsByIdService,
    updateDoctorsService,
    deleteDoctorsService,
    doctorsOptionsService
};

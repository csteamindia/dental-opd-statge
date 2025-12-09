import db from '../models/index.js';
import 'dotenv/config';
const { Banks, Clinics, User, Sequelize } = db;
import { getAllClinicsByClinicClientIdUseingClinicId } from '../utils/Basicutils.js';

const createBanksService = async (req) => {
    const { body } = req;
    try {
        const res = await Banks.create(body);
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllBanksService = async (req) => {
    try {
        const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
        const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

        const where = {};
        if (clinic_id) {
            const cId = await getAllClinicsByClinicClientIdUseingClinicId(clinic_id);
            where.clinic_id = { [Sequelize.Op.in]: [cId] }
        }

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

        const result = await Banks.findAndCountAll(condition);

        return {
            totalItems: result.count,
            totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
            currentPage: parsedPage,
            items: result.rows,

        };
    } catch (e) {
        console.error('Error fetching all banks:', e.message);
        return { success: false, message: e.message };
    }
};

const getBanksByIdService = async (req) => {
    try {
        const { id } = req.params;
        const res = await Banks.findOne({
            where: {
                id,
                status: 0
            },
            attributes: { exclude: ['created_at', 'updated_at'] },
        });
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const updateBanksService = async (req) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const res = await Banks.update(body, {
            where: {
                id,
                status: 0
            }
        });
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const deleteBanksService = async (req) => {
    try {
        const { id } = req.params;
        const { sts } = req.query
        const res = await Banks.update(
            { status: sts },
            { where: { id } }
        );
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export {
    createBanksService,
    getAllBanksService,
    getBanksByIdService,
    updateBanksService,
    deleteBanksService
};

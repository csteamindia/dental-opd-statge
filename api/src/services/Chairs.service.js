import db from '../models/index.js';
import 'dotenv/config';
const { Chairs, Clinics, User } = db;

const createChairsService = async (req) => {
    const { body } = req;
    try {
        const res = await Chairs.create(body);
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllChairsService = async (req) => {
    try {
        const { query: {clinic_id, client_id, page = 1, limit = 10}, body, tokendata } = req;
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
        const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

        const where = { status: 0 };

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
            order: [['id', 'ASC']],
        };

        if (clinic_id) {
            condition.where = [{
                clinic_id: clinic_id
            }]
        }

        if (parsedLimit) {
            condition.limit = parsedLimit;
            condition.offset = offset;
        }

        const result = await Chairs.findAndCountAll(condition);

        return {
            totalItems: result.count,
            totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
            currentPage: parsedPage,
            items: result.rows,
        };
    } catch (e) {
        console.error('Error fetching all chairs:', e.message);
        return { success: false, message: e.message };
    }
};


const getChairsByIdService = async (req) => {
    try {
        const { id } = req.params;
        const res = await Chairs.findOne({
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

const updateChairsService = async (req) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const res = await Chairs.update(body, {
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

const deleteChairsService = async (req) => {
    try {
        const { id } = req.params;
        const {sts}=req.query
        const res = await Chairs.update(
            { status:sts },
            {
                where: { id }
            }
        );
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export {
    createChairsService,
    getAllChairsService,
    getChairsByIdService,
    updateChairsService,
    deleteChairsService
};

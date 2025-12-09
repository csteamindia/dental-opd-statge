import db from '../models/index.js';
import 'dotenv/config';
const { Tags, Clinics, User, Sequelize } = db;

const createTagsService = async (req) => {
    const { body } = req;
    try {
        const res = await Tags.create(body);
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllTagsService = async (req) => {
    try {
        const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = limit === 'all' ? 'all' : parseInt(limit) || 10;
        const offset = (parsedPage - 1) * parsedLimit;

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
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: [
                {
                    model: Clinics,
                    as: 'clinic',
                    required: false,
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

        if (parsedLimit !== 'all') {
            condition.limit = parsedLimit;
            condition.offset = offset;
        }

        const result = await Tags.findAndCountAll(condition);

        return {
            success: true,
            body: {
                totalItems: result.count,
                totalPages: parsedLimit === 'all' ? 1 : Math.ceil(result.count / parsedLimit),
                currentPage: parsedLimit === 'all' ? 1 : parsedPage,
                items: result.rows,
            },
        };
    } catch (e) {
        console.log('Error in getAllTagsService:', e);
        return { success: false, body: [], error: e.message };
    }
};


const getTagsByIdService = async (req) => {
    try {
        const { id } = req.params;
        const res = await Tags.findOne({
            where: {
                id,
                status: 0,
            },
            attributes: { exclude: ['created_at', 'updated_at'] },
        });
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const updateTagsService = async (req) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const res = await Tags.update(body, {
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

const deleteTagsService = async (req) => {
    try {
        const { id } = req.params;
        const { sts } = req.query
        const res = await Tags.update(
            { status: sts },
            {
                where: { id }
            }
        );
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

export {
    createTagsService,
    getAllTagsService,
    getTagsByIdService,
    updateTagsService,
    deleteTagsService
};

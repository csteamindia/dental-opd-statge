import db from '../models/index.js';
import 'dotenv/config';
const { Modules, User } = db;

const createModulesService = async (req) => {
    const { body } = req;
    try {
        const res = await Modules.create(body);
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllModulesService = async (req) => {
    try {
        const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = limit === 'all' ? null : parseInt(limit, 10) || 10;
        const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

        const where = { status: 0 };
        if (client_id) where.client_id = client_id;

        const condition = {
            where,
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: [
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

        if (parsedLimit) {
            condition.limit = parsedLimit;
            condition.offset = offset;
        }

        const result = await Modules.findAndCountAll(condition);

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

export {
    createModulesService,
    getAllModulesService
};

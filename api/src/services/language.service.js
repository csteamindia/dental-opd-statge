import db from '../models/index.js';
import 'dotenv/config';
const { Language, Clinics, User, Sequelize } = db;

const createLanguageService = async req => {
    const { body } = req;
    try {
        const res = await Language.create(body);
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllLanguagesService = async req => {
    try {
        const { clinic_id, client_id, page = 1, limit = 10 } = req.query;

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = limit === 'all' ? 'all' : parseInt(limit) || 10;
        const offset = (parsedPage - 1) * parsedLimit;

        const where = {};
        if(clinic_id) {
            where.clinic_id = {
                [Sequelize.Op.or]: [clinic_id, null]
            };
        }

        if(client_id) {
            where.client_id = {
                [Sequelize.Op.or]: [client_id, null]
            };
        }

        const condition = {
            where,
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: [
                {
                    model: Clinics,
                    as: 'clinic',
                    attributes: { exclude: ['created_at', 'updated_at'] },
                },
                {
                    model: User,
                    as: 'client',
                    attributes: { exclude: ['created_at', 'updated_at'] },
                },
            ],
            order: [['id', 'DESC']],
        };

        if (parsedLimit !== 'all') {
            condition.limit = parsedLimit;
            condition.offset = offset;
        }

        const result = await Language.findAndCountAll(condition);

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

const getLanguageByIdService = async req => {
    try {
        const { id } = req.params;
        const res = await Language.findOne({
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

const updateLanguageService = async req => {
    try {
        const { id } = req.params;
        const { body } = req;
        const res = await Language.update(body, {
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

const deleteLanguageService = async req => {
    try {
        const { id } = req.params;
        const { sts } = req.query
        const res = await Language.update(
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
    createLanguageService,
    getAllLanguagesService,
    getLanguageByIdService,
    updateLanguageService,
    deleteLanguageService
};

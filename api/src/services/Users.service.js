import db from '../models/index.js';
import 'dotenv/config';
import { newRegistrationService } from './Auth.service.js'

const { User, Role, Userconfig } = db;

const createUserService = async (req) => {
    try {
        return await newRegistrationService(req, true);
        // const res = await User.create(body);
        // return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const getAllUserService = async req => {
    try {
        const { clinic_id, client_id, page = 1, limit = 10 } = req.query;

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = limit === 'all' ? 'all' : parseInt(limit) || 10;
        const offset = (parsedPage - 1) * parsedLimit;

        const where = {};
        if (clinic_id) {
            where.clinic_id = clinic_id
        }
        if (client_id) {
            where.client_id = client_id;
        }

        const condition = {
            where,
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: [{
                model: Role,
                as: 'user_role',
                attributes: ['name']
            }],
            order: [['user_id', 'DESC']],
        };        

        if (parsedLimit !== 'all') {
            condition.limit = parsedLimit;
            condition.offset = offset;
        }

        const result = await User.findAndCountAll(condition);

        return {
            totalItems: result.count,
            totalPages: parsedLimit === 'all' ? 1 : Math.ceil(result.count / parsedLimit),
            currentPage: parsedLimit === 'all' ? 1 : parsedPage,
            items: result.rows,
        }
    } catch (e) {
        console.log('Error in getAllTagsService:', e);
        return { success: false, body: [], error: e.message };
    }
};

const getUsersByIdService = async (req) => {
    try {
        const { id } = req.params;
        const res = await User.findOne({
            where: {
                user_id:id,
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

const updateUsersService = async (req) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const res = await User.update(body, {
            where: {
                user_id:id,
                status: 0
            }
        });
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

const deleteUsersService = async (req) => {
    try {
        const { id } = req.params;
        const { sts } = req.query
        const res = await User.update(
            { status: sts },
            {
                where: { user_id: id }
            }
        );
        return res;
    } catch (e) {
        console.log(e);
        return e;
    }
};

export {
    createUserService,
    getAllUserService,
    getUsersByIdService,
    updateUsersService,
    deleteUsersService
};

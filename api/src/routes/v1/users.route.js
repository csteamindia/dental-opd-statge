import express from 'express';
import {
    createUser,
    getAllUsers,
    getUsersById,
    updateUsers,
    deleteUsers
} from '../../controllers/Users.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
    .all(validateToken, authorize())
    .post(createUser)
    .get(getAllUsers);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getUsersById)
    .put(updateUsers)
    .delete(deleteUsers);

export default router;
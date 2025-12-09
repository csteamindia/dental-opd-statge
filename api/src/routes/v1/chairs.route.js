import express from 'express';
import {
    createChairs,
    getAllChairs,
    getChairsById,
    updateChairs,
    deleteChairs
} from '../../controllers/Chairs.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
    .all(validateToken, authorize())
    .post(createChairs)
    .get(getAllChairs);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getChairsById)
    .put(updateChairs)
    .delete(deleteChairs);

export default router;

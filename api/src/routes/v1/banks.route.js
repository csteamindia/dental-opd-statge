import express from 'express';
import {
    createBanks,
    getAllBanks,
    getBanksById,
    updateBanks,
    deleteBanks
} from '../../controllers/Banks.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
    .all(validateToken, authorize())
    .post(createBanks)
    .get(getAllBanks);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getBanksById)
    .put(updateBanks)
    .delete(deleteBanks);

export default router;

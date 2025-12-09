import express from 'express';
import {
    createDoctorTimings,
    getAllDoctorTimings,
    getDoctorTimingsById,
    updateDoctorTimings,
    deleteDoctorTimings
} from '../../controllers/DoctorTimings.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
    .all(validateToken, authorize())
    .post(createDoctorTimings)
    .get(getAllDoctorTimings);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getDoctorTimingsById)
    .put(updateDoctorTimings)
    .delete(deleteDoctorTimings);

export default router;

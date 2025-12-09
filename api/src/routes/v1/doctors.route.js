import express from 'express';
import {
    createDoctors,
    getAllDoctors,
    getDoctorsById,
    updateDoctors,
    deleteDoctors,
    getDoctorsOptions
} from '../../controllers/Doctors.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/options')
    .all(validateToken, authorize())
    .get(getDoctorsOptions);

router.route('/')
    .all(validateToken, authorize())
    .post(createDoctors)
    .get(getAllDoctors);

router.route('/options')
    .all(validateToken, authorize())
    .get(getDoctorsOptions);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getDoctorsById)
    .put(updateDoctors)
    .delete(deleteDoctors);

export default router;

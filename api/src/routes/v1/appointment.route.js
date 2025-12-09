import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getTodoAppointments,
  cancelAppointment
} from '../../controllers/Appointments.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createAppointment)
  .get(getAllAppointments);

router.route('/cancel')
  .all(validateToken, authorize())
  .post(cancelAppointment);

router.route('/todo')
  .all(validateToken, authorize())
  .get(getTodoAppointments);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;

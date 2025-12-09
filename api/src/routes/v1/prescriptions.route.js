import express from 'express';
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} from '../../controllers/Prescriptions.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createPrescription)
  .get(getAllPrescriptions);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getPrescriptionById)
  .put(updatePrescription)
  .delete(deletePrescription);

export default router;

import express from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  patientSummary,
  getPatientByIdView,
  updateProfile
} from '../../controllers/Patients.controller.js';
import { dynamicOptions, dynamicPatientOptions } from '../../controllers/Options.controller.js';
import validateToken from '../../middlewares/validate-token.js'
import { authorize } from '../../middlewares/authorize.js';
import { uploadMultipleImages } from '../../middlewares/upload.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createPatient)
  .get(getAllPatients);

router.route('/profile/options')
  .all(validateToken, authorize())
  .get(dynamicPatientOptions);

router.route('/profile')
  .all(validateToken, authorize())
  .post(uploadMultipleImages('files[]', 1), updateProfile);

router.route('/summary')
  .all(validateToken, authorize())
  .get(patientSummary);

router.route('/options')
  .all(validateToken)
  .get(dynamicOptions);

router.route('/view/:id')
  .all(validateToken, authorize())
  .get(getPatientByIdView);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

export default router;

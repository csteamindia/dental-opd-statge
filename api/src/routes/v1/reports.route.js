import express from 'express';
import { appointmentReports, appointmentWaitningReports, patientgReports, doctorsWorkReports, patientFilesReports, referenceReports, birthdayReports, followsReports } from '../../controllers/Reports.controller.js';
import validateToken from '../../middlewares/validate-token.js';

const router = express.Router();

router.route('/appointments')
    .all(validateToken)
    .get(appointmentReports);

router.route('/appointment-waiting')
    .all(validateToken)
    .get(appointmentWaitningReports);

router.route('/patients')
    .all(validateToken)
    .get(patientgReports);

router.route('/doctors-work')
    .all(validateToken)
    .get(doctorsWorkReports);

router.route('/patient-files')
    .all(validateToken)
    .get(patientFilesReports);

router.route('/references-reports')
    .all(validateToken)
    .get(referenceReports);

router.route('/birthdays')
    .all(validateToken)
    .get(birthdayReports);

router.route('/follows')
    .all(validateToken)
    .get(followsReports);

export default router;

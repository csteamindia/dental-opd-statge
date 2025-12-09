/* eslint-disable max-len */
/**
 * Investigation routes
 *
 * @author Praveenumar Yennam
 */

import express from 'express';
import {
  createInvestigation,
  getAllInvestigations,
  getInvestigationById,
  updateInvestigation,
  deleteInvestigation
} from '../../controllers/Investigations.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Create new investigation
router.route('/')
  .all(validateToken, authorize())
  .post(createInvestigation)
  .get(getAllInvestigations)

router.route('/:id')

  .all(validateToken, authorize())
  .get(getInvestigationById)
  .put(updateInvestigation)
  .delete(deleteInvestigation);

export default router;

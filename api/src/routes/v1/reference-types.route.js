import express from 'express';
import {
  createReferenceType,
  getAllReferenceTypes,
  getReferenceTypeById,
  updateReferenceType,
  deleteReferenceType
} from '../../controllers/ReferenceTypes.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createReferenceType)
  .get(getAllReferenceTypes);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getReferenceTypeById)
  .put(updateReferenceType)
  .delete(deleteReferenceType);

export default router;

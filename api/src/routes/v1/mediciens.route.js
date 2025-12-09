// routes/Mediciens.routes.js
import express from 'express';
import {
  createMedicien,
  getAllMediciens,
  getMedicienById,
  updateMedicien,
  deleteMedicien
} from '../../controllers/Mediciens.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createMedicien)
  .get(getAllMediciens);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getMedicienById)
  .put(updateMedicien)
  .delete(deleteMedicien);

export default router;

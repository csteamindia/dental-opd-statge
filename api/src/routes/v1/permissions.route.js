import express from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission
} from '../../controllers/Permissions.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createPermission)
  .get(getAllPermissions);

router.route('/:permission_id')
  .all(validateToken, authorize())
  .get(getPermissionById)
  .put(updatePermission)
  .delete(deletePermission);

export default router;

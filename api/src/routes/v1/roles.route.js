import express from 'express';
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../../controllers/Roles.controller.js';
import { dynamicOptions } from '../../controllers/Options.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/options')
  .all(validateToken, authorize())
  .get(dynamicOptions);

  
router.route('/:role_id')
.all(validateToken, authorize())
.get(getRoleById)
.put(updateRole)
.delete(deleteRole);
  
router.route('/')
  .all(validateToken, authorize())
  .post(createRole)
  .get(getAllRoles);

export default router;

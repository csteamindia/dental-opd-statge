import express from 'express';
import {
    createCommunicationGroup,
    getAllCommunicationGroups,
    getCommunicationGroupById,
    updateCommunicationGroup,
    deleteCommunicationGroup
} from '../../controllers/CommunicationGroup.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
    .all(validateToken, authorize())
    .post(createCommunicationGroup)
    .get(getAllCommunicationGroups);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getCommunicationGroupById)
    .put(updateCommunicationGroup)
    .delete(deleteCommunicationGroup);

export default router;

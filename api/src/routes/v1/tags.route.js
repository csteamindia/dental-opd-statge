import express from 'express';
import { createTags, getAllTags, getTagsById, updateTags, deleteTags } from '../../controllers/Tags.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
    .all(validateToken, authorize())
    .post(createTags)
    .get(getAllTags);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getTagsById)
    .put(updateTags)
    .delete(deleteTags);

export default router;
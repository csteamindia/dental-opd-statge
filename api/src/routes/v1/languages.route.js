/* eslint-disable max-len */
import express from 'express';
import { createLanguage, getAllLanguages, getLanguageById, updateLanguage, deleteLanguage } from '../../controllers/language.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
    .all(validateToken, authorize())
    .post(createLanguage)
    .get(getAllLanguages);

router.route('/:id')
    .all(validateToken, authorize())
    .get(getLanguageById)
    .put(updateLanguage)
    .delete(deleteLanguage);

export default router;
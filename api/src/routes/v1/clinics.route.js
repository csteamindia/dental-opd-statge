import express from 'express';
import multer from 'multer';
import fs from 'fs';

import {
  createClinic,
  getAllClinics,
  getClinicById,
  updateClinic,
  deleteClinic,
  defaultClinic,
  clinicImageUpload
} from '../../controllers/Clinics.controller.js';
// import { uploadSingleImage } from '../../utils/media.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dirPath = `./uploads/${req.body.dir}`;
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(`./uploads/${req.body.dir}`, { recursive: true });
    }
    if (fs.existsSync(dirPath)) {
      cb(null, dirPath)
    } else {
      cb(new Error("Directory not found"), dirPath)
    }

  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg'
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

router.route('/')
  .all(validateToken)
  .all(validateToken, authorize())
  .post(createClinic)
  .get(getAllClinics);

router.route('/defaultclinic')
  .all(validateToken, authorize())
  .get(defaultClinic);

router.route('/:id')
  .all(validateToken, authorize())
  .get(getClinicById)
  .put(updateClinic)
  .delete(deleteClinic);

router.route('/clinic-image')
  .all(validateToken, authorize())
  .post(upload.single('image'), clinicImageUpload)

export default router;

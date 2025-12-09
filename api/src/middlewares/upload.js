import multer from 'multer';
import path from 'path';
import fs from 'fs';

const rootUploadPath = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { patient_id, client_id, clinic_id } = req.query;
    const { file_type } = req.body;

    if (!client_id || !clinic_id) {
      return cb(new Error('Missing client_id or clinic_id in query'), null);
    }

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const uploadDir = path.join(
      rootUploadPath,
      client_id.toString(),
      clinic_id.toString(),
      patient_id.toString(),
      file_type.toString());

    // Create directory if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        return cb(err, null);
      }
      cb(null, uploadDir);
    });
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// Middleware
export const uploadMultipleImages = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
      }

      const filePaths = req.files.map((file) => {
        const path = file.path.split('uploads')[1].replace(/\\/g, '/'); 

        return {
          path: `/uploads${path}`,
          originalname: file.filename,
          mimetype: file.mimetype,
          size: formatFileSize(file.size)
        };
      });

      req.body.files = filePaths;
      next();
    });
  };
};

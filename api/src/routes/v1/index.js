import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatically import all route files
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.route.js'))
  .forEach(async (file) => {
    const routeName = `${file.split('.')[0]}`;
    const route = (await import(`./${file}`)).default;
    router.use(`/${routeName.replaceAll('_', '-')}`, route);
  });

export default router;

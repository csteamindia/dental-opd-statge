import fs from 'fs';
import { basename, dirname } from 'path';
import { DataTypes, Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import sequelize from '../config/sequelize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const base = basename(__filename);
const db = {};

const initConfig = async () => {
  try {
    const files = fs
      .readdirSync(__dirname)
      .filter(file => file.indexOf('.') !== 0 && file !== base && file.slice(-3) === '.js');

    await Promise.all(files.map(async file => {
      const modelModule = await import(`../models/${file}`);
      const model = modelModule.default || modelModule;  // Support both named and default exports
      const modelInstance = model(sequelize, DataTypes);  // Execute the model function
      db[modelInstance.name] = modelInstance;
    }));

    // Associate models if they have associations
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db); 
      }
    });

    // Sync all models with the database
    // await sequelize.sync({ alter: true });
    // console.log('Database synchronized successfully');

  } catch (err) {
    console.error('Error initializing the database models:', err);
  }
};

await initConfig();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

import { createNamespace } from 'cls-hooked';
import { Sequelize, Transaction } from 'sequelize';
import 'dotenv/config';
const namespace = createNamespace('my-namespace');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
    logging: true,
    timezone: '+05:30',
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  },
);

// Enable logging for debugging
const loggingFunction = (sql) => {
  console.log({sql});
};

try {
  await sequelize.authenticate();

  console.log('Connection has been established successfully.');
  sequelize.options.logging = loggingFunction;
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;

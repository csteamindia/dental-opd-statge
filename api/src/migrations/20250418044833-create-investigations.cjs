// 'use strict';

// export const up = async (queryInterface) => {
//   await queryInterface.sequelize.query(`
//     CREATE TABLE Investigations
//     (
//       id INT AUTO_INCREMENT NOT NULL,
//       date DATE NOT NULL,
//       temperature VARCHAR(255),
//       blood_pressure VARCHAR(255),
//       blood_sugar VARCHAR(255),
//       auscultation VARCHAR(255) COMMENT 'OS (Other Sounds)',
//       patient_id INT NOT NULL,
//       clinic_id INT NOT NULL,
//       doctor_id INT NOT NULL,
//       examination TEXT,
//       chief_complaint TEXT,
//       diagnosis_type VARCHAR(255),
//       note TEXT,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP NULL,
//       PRIMARY KEY (id)
//     );
//   `);
// };

// export const down = async (queryInterface) => {
//   await queryInterface.dropTable('Investigations');
// };

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Investigations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      temperature: {
        type: Sequelize.STRING
      },
      blood_pressure: {
        type: Sequelize.STRING
      },
      blood_sugar: {
        type: Sequelize.STRING
      },
      auscultation: {
        type: Sequelize.STRING,
        comment: 'OS (Other Sounds)'
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      clinic_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      examination: {
        type: Sequelize.TEXT
      },
      chief_complaint: {
        type: Sequelize.TEXT
      },
      diagnosis_type: {
        type: Sequelize.STRING
      },
      status: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0  // Default value for status
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Investigations');
  }
};

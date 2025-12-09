'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('examinations', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      examination_date: {
        type: Sequelize.DATE
      },
      doctor: {
        type: Sequelize.STRING
      },
      examination: {
        type: Sequelize.STRING
      },
      treatment: {
        type: Sequelize.STRING
      },
      tooth: {
        type: Sequelize.TEXT
      },
      client_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      patient_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      clinic_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      remark: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('examinations');
  }
};



'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dental_charts', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      treatment_plan: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      doctor_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      treatment_type: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      treatment: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      total_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      total_discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      final_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      is_multiply: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_confirm: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_patient: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_treatment_plan: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_billed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      clinic_id: {
        type: Sequelize.STRING(36),
        allowNull: true
      },
      client_id: {
        type: Sequelize.STRING(36),
        allowNull: true
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dental_charts');
  }
};

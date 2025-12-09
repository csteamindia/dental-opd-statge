'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prescriptions', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      doctor_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      medicine: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      investigation_attachment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
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
        allowNull: false,
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

  async down(queryInterface) {
    await queryInterface.dropTable('prescriptions');
  }
};

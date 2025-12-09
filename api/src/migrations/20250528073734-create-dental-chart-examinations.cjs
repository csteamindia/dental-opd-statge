"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Dental_Chart_Examinations", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tooth: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      examination: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      treatment_type: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_saved: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
      clinic_id: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      client_id: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Dental_Chart_Examinations");
  },
};

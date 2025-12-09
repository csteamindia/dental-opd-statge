"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tretment", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(11),
      },
      doctor_id: {
        type: Sequelize.STRING(26),
        allowNull: false,
      },
      tretment_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      client_id: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      clinic_id: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
      },
      is_billed: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
      },
      billed_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      treatment_status: {
        type: Sequelize.ENUM(
          "planned",
          "in_progress",
          "completed",
          "discontinued"
        ),
        allowNull: false,
        defaultValue: "planned",
      },
      treatment_cost: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      treatment_discount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      treatment_discount_type: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: "0 - amount\n1 - percentage",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tretment");
  },
};

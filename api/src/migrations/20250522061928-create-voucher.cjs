"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vouchers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      receipt: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      no_of_entries: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_value: {
        type: Sequelize.DECIMAL(10, 2),
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
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Vouchers");
  },
};

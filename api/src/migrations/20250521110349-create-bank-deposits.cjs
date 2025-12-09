"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bank_Deposits", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      bank_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      deposit_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      deposit_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deposit_type: {
        type: Sequelize.ENUM("cash", "cheque", "online"),
        allowNull: false,
      },
      reference_no: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bank_Deposits");
  },
};

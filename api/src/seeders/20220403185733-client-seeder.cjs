'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('client', [{
      name: 'Demo Clinic',
      email: 'demo@clinic.com',
      mobile: '1234567890',
      ip_address: '127.0.0.1',
      location: 'New York',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('client', null, {});
  }
};
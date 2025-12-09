'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('doctor', [{
      name: 'Dr. John Doe',
      email: 'john.doe@clinic.com',
      mobile: '1234567890',
      registration_no: 'DOC123456',
      color_code: '#FF5733',
      signature: 'data:image/png;base64,signature_data',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('doctor', null, {});
  }
};
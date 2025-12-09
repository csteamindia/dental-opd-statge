'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('clinic_mapping', [{
      doctor_id: '1',
      clinic_id: '1',
      is_accessable: 1,
      is_verified_access: 1,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('clinic_mapping', null, {});
  }
};
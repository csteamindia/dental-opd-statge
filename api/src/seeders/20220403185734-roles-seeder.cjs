'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        clinic_id: 1,
        name: 'Super Admin',
        description: 'System Administrator',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clinic_id: 1,
        name: 'Doctor',
        description: 'Clinic Doctor',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        clinic_id: 1,
        name: 'Staff',
        description: 'Clinic Staff',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('permissions', [
      {
        name: 'User Management',
        role_id: 1,
        clinic_id: 1,
        module_name: 'users',
        is_accessable: 1,
        is_creatable: 1,
        is_readable: 1,
        is_writable: 1,
        is_deletable: 1,
        is_creatable_checkbox: 1,
        is_readable_checkbox: 1,
        is_writable_checkbox: 1,
        is_deletable_checkbox: 1,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
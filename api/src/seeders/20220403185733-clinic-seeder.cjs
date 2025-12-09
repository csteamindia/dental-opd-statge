'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('clinic', [
      {
        client_id: 1,
        clinic_name: 'Demo Dental Clinic',
        clinic_logo: 'default-logo.png',
        clinic_access_code: 'DC001',
        clinic_locality: 'Central',
        doctor_id: 1,
        address: '123 Main Street, Suite 100',
        alternative_address: '456 Medical Plaza',
        country: 1,
        state: 1,
        city: 'New York',
        zipcode: 10001,
        time_zone: 'America/New_York',
        is_default: 1,
        koisk_access_code: 'KIOSK001',
        patient_portal_access_code: 'PORTAL001',
        signature: 'default-signature.png',
        expries_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        created_at: new Date(),
        updated_at: null,
        status: 1
      },
      {
        client_id: 1,
        clinic_name: 'Branch Dental Clinic',
        clinic_logo: 'branch-logo.png',
        clinic_access_code: 'DC002',
        clinic_locality: 'Downtown',
        doctor_id: 1,
        address: '789 Health Avenue',
        alternative_address: '321 Dental Street',
        country: 1,
        state: 1,
        city: 'New York',
        zipcode: 10002,
        time_zone: 'America/New_York',
        is_default: 0,
        koisk_access_code: 'KIOSK002',
        patient_portal_access_code: 'PORTAL002',
        signature: 'branch-signature.png',
        expries_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        created_at: new Date(),
        updated_at: null,
        status: 1
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('clinic', null, {});
  }
};

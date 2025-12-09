module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE appointments
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        patinet_code VARCHAR(16),
        doctor_code VARCHAR(16),
        appointment_date DATETIME NULL,
        chair_code VARCHAR(16),
        tretment_code VARCHAR(16),
        notes TEXT,
        notification_status TINYINT(1) DEFAULT 0,
        notification_for_patinet TINYINT(1) DEFAULT 0,
        notification_for_doctor TINYINT(1) DEFAULT 0,
        clinic_id VARCHAR(36),
        client_id VARCHAR(36),
        status TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (id)
      );
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('appointments');
  }
};
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE doctor_timings
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        doctor_code VARCHAR(16),
        start_time TIME,
        end_time TIME,
        exe_time INT,
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
    await queryInterface.dropTable('doctor_timings');
  }
};
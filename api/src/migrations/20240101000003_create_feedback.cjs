module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE feedback
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        patinet_code VARCHAR(16),
        doctor_code VARCHAR(16),
        queation_code VARCHAR(16),
        remark VARCHAR(320),
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
    await queryInterface.dropTable('feedback');
  }
};

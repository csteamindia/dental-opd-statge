module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE doctors
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        code VARCHAR(16),
        name VARCHAR(160),
        mobile VARCHAR(16),
        email VARCHAR(320),
        registration_no VARCHAR(60),
        color_code VARCHAR(26),
        signature TEXT,
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
    await queryInterface.dropTable('doctors');
  }
};
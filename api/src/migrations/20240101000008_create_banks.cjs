module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE banks
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        bank_name VARCHAR(160),
        ac_no VARCHAR(16),
        ifsc_code VARCHAR(20),
        branch VARCHAR(160),
        addrress VARCHAR(320),
        ac_type ENUM('savings','current'),
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
    await queryInterface.dropTable('banks');
  }
};
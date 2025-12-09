module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE mediciens
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        name VARCHAR(160),
        molucule VARCHAR(160),
        dose VARCHAR(16),
        frequent VARCHAR(16),
        duration VARCHAR(16),
        is_fevrate TINYINT(1) DEFAULT 0,
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
    await queryInterface.dropTable('mediciens');
  }
};

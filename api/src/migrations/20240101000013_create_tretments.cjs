module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE tretments
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        title VARCHAR(160),
        cost VARCHAR(16),
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
    await queryInterface.dropTable('tretments');
  }
};

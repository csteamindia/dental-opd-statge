module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE patient_tags
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        title VARCHAR(160),
        description VARCHAR(260),
        start_time TIME NULL,
        end_time TIME NULL,
        cabin_no INT,
        intervel INT,
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
    await queryInterface.dropTable('patient_tags');
  }
};
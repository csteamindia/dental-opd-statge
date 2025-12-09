module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE roles
      (
        role_id BIGINT AUTO_INCREMENT NOT NULL,
        clinic_id BIGINT NOT NULL,
        name VARCHAR(128),
        description VARCHAR(160),
        status TINYINT(1) DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (role_id)
      );
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('roles');
  }
};
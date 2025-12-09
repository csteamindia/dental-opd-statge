module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE permissions
      (
        permission_id BIGINT AUTO_INCREMENT NOT NULL,
        name VARCHAR(128),
        role_id BIGINT NOT NULL,
        clinic_id BIGINT NOT NULL,
        module_name VARCHAR(128),
        is_accessable TINYINT(1) DEFAULT 0 NOT NULL,
        is_creatable TINYINT(1) DEFAULT 0 NOT NULL,
        is_readable TINYINT(1) DEFAULT 0 NOT NULL,
        is_writable TINYINT(1) DEFAULT 0 NOT NULL,
        is_deletable TINYINT(1) DEFAULT 0 NOT NULL,
        is_creatable_checkbox TINYINT(1) DEFAULT 0 NOT NULL,
        is_readable_checkbox TINYINT(1) DEFAULT 0 NOT NULL,
        is_writable_checkbox TINYINT(1) DEFAULT 0 NOT NULL,
        is_deletable_checkbox TINYINT(1) DEFAULT 0 NOT NULL,
        status TINYINT(1) DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (permission_id)
      );
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('permissions');
  }
};

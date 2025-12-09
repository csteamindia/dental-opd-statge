module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE users
      (
          user_id BIGINT AUTO_INCREMENT NOT NULL,
          name VARCHAR(128),
          email VARCHAR(160),
          mobile Varchar(15),
          is_verified INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NULL,
          PRIMARY KEY (user_id)
      );
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
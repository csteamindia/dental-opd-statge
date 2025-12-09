module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE clinics
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        clinic_name VARCHAR(100),
        doctor_code VARCHAR(100),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        time_zone VARCHAR(50),
        zip_code VARCHAR(20),
        client_id BIGINT(36),
        is_default TINYINT(1) DEFAULT 0,
        kiosk_code TEXT,
        access_code TEXT,
        clinic_url TEXT,
        status TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (id)
      );
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('clinics');
  }
};

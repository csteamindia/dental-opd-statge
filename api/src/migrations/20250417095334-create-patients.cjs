

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE patients
      (
        id BIGINT AUTO_INCREMENT NOT NULL,
        date DATE,
        case_no VARCHAR(50),
        title VARCHAR(10),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        dob DATE,
        age INT,
        gender VARCHAR(10),
        mobile VARCHAR(15),
        email VARCHAR(100),
        profile_pic VARCHAR(255),
        communication_group_id BIGINT,
        language VARCHAR(50),
        patient_tags TEXT,
        allergies TEXT,
        address TEXT,
        state VARCHAR(100),
        city VARCHAR(100),
        country VARCHAR(100),
        alternative_email VARCHAR(100),
        alternative_mobile VARCHAR(15),
        reference_type VARCHAR(50),
        patient_relationship VARCHAR(50),
        clinic_id VARCHAR(36),
        client_id VARCHAR(36),
        status TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (id)
      );`
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('patients');
  }
};


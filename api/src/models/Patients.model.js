export default (sequelize, DataTypes) => {
  const Patients = sequelize.define(
    "Patients",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      case_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      profile_pic: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      communication_group: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      patient_tags: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      allergies: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      alternative_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      alternative_mobile: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      reference_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      patient_relationship: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      clinic_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      client_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      zip_code: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "patients",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Patients.associate = models => {
    Patients.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Patients.belongsTo(models.Doctors, {
      foreignKey: "doctor",
      targetKey: "code",
      as: "doctors",
    });

    Patients.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });

    Patients.belongsTo(models.ReferenceTypes, {
      foreignKey: "reference_type",
      targetKey: "id",
      as: "referenceType",
    });

    Patients.belongsTo(models.Doctors, {
      foreignKey: "reference",
      targetKey: "code",
      as: "ref_doctors",
    });

    Patients.belongsTo(models.User, {
      foreignKey: "reference",
      targetKey: "user_id",
      as: "ref_client",
    });

    Patients.belongsTo(models.Patients, {
      foreignKey: "reference",
      targetKey: "id",
      as: "ref_patient",
    });

    Patients.hasMany(models.Allergies, {
      foreignKey: 'allergies',
      sourceKey: 'allergies',
      as: 'ref_allergies'
    });
  };

  return Patients;
};

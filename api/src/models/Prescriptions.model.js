// src/models/Prescription.model.js

export default (sequelize, DataTypes) => {
  const Prescription = sequelize.define(
    "Prescription",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      doctor_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      medicine: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      investigation_attachment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
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
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "prescriptions",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Prescription.associate = (models) => {
    Prescription.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Prescription.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
    Prescription.belongsTo(models.Doctors, {
      foreignKey: "doctor_code",
      targetKey: "code",
      as: "doctor",
    });
    Prescription.belongsTo(models.Mediciens, {
      foreignKey: "medicine",
      targetKey: "name",
      as: "medicines",
    });
    // Prescription.belongsTo(models.patients, {
    //   foreignKey: "patient_id",
    //   targetKey: "id",
    //   as: "patient",
    // });
  };

  return Prescription;
};

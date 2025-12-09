"use strict";

export default (sequelize, DataTypes) => {
  const Examinations = sequelize.define(
    "Examinations",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      examination_date: {
        type: DataTypes.DATE,
      },
      doctor: {
        type: DataTypes.STRING,
      },
      examination: {
        type: DataTypes.STRING,
      },
      treatment: {
        type: DataTypes.STRING,
      },
      tooth: {
        type: DataTypes.TEXT,
      },
      client_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      clinic_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "examinations",
      timestamps: false,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Examinations.associate = (models) => {
    Examinations.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Examinations.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
    Examinations.belongsTo(models.Patients, {
      foreignKey: "patient_id",
      targetKey: "id",
      as: "patient",
    });
    Examinations.belongsTo(models.Doctors, {
      foreignKey: "doctor",
      targetKey: "code",
      as: "doctors",
    });
  };

  return Examinations;
};

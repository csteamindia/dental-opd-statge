// models/Feedback.js
export default (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    "Feedback",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_code: {
        type: DataTypes.STRING(16),
      },
      doctor_code: {
        type: DataTypes.STRING(16),
      },
      queation_code: {
        type: DataTypes.STRING(16),
      },
      remark: {
        type: DataTypes.STRING(320),
      },
      clinic_id: {
        type: DataTypes.STRING(36),
      },
      client_id: {
        type: DataTypes.STRING(36),
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "feedback",
      timestamps: false,
      underscored: true,
    }
  );
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Feedback.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
    Feedback.belongsTo(models.Patients, {
      foreignKey: "patient_code",
      targetKey: "case_no",
      as: "patient",
    });
    Feedback.belongsTo(models.Doctors, {
      foreignKey: "doctor_code",
      targetKey: "code",
      as: "doctor",
    });
  };

  return Feedback;
};

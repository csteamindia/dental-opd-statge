export default (sequelize, DataTypes) => {
  const Patient_Follow_Up = sequelize.define(
    "Patient_Follow_Up",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      followup_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      added_by: {
        type: DataTypes.BIGINT,
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
      remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "patient_follow_up", // ✅ corrected to match migration
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Patient_Follow_Up.associate = (models) => {
    Patient_Follow_Up.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Patient_Follow_Up.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });

    Patient_Follow_Up.belongsTo(models.Patients, {
      foreignKey: "patient_id",
      targetKey: "id",
      as: "patient",
    });
  };

  return Patient_Follow_Up;
};

export default (sequelize, DataTypes) => {
  const DentalChart = sequelize.define(
    "DentalChart",
    {
      doctor_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      treatment_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      toothinfo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      examination: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      treatment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      final_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      is_multiply: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_confirm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_patient: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_treatment_plan: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_billed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      clinic_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      tableName: "dental_charts",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  DentalChart.associate = (models) => {
    DentalChart.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    DentalChart.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });

    DentalChart.belongsTo(models.Doctors, {
      foreignKey: "doctor_id",
      targetKey: "code",
      as: "doctor",
    });
  };

  return DentalChart;
};

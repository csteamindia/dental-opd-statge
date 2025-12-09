export default (sequelize, DataTypes) => {
  const Billing = sequelize.define(
    "Billing",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      treatment_ids: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      treatment_info: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      billing_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      pending: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
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
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "Billings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Billing.associate = models => {
    Billing.belongsTo(models.Patients, {
      foreignKey: "patient_id",
      targetKey: "id",
      as: "patients",
    });
    Billing.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });
    
    Billing.belongsTo(models.Tretment, {
      foreignKey: "treatment_ids",
      targetKey: "id",
      as: "treatment",
    });

    Billing.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return Billing;
};

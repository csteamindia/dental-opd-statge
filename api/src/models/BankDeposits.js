export default (sequelize, DataTypes) => {
  const BankDeposits = sequelize.define(
    "Bank_Deposits",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      bank_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      deposit_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      deposit_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deposit_type: {
        type: DataTypes.ENUM("cash", "cheque", "online"),
        allowNull: false,
      },
      reference_no: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
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
      tableName: "bank_deposits",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  BankDeposits.associate = (models) => {
    BankDeposits.belongsTo(models.Banks, {
      foreignKey: "bank_id",
      targetKey: "id",
      as: "bank",
    });
    BankDeposits.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    BankDeposits.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return BankDeposits;
};

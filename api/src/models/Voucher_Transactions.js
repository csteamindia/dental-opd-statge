export default (sequelize, DataTypes) => {
  const Voucher_Transactions = sequelize.define(
    "Voucher_Transactions",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      voucher_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      entity: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "voucher",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
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
      tableName: "Voucher_Transactions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Voucher_Transactions.associate = (models) => {
    Voucher_Transactions.belongsTo(models.Vouchers, {
      foreignKey: "voucher_id",
      targetKey: "id",
      as: "voucher",
    });

    Voucher_Transactions.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Voucher_Transactions.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };
  return Voucher_Transactions;
};

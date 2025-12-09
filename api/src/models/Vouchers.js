export default (sequelize, DataTypes) => {
  const Vouchers = sequelize.define(
    "Vouchers",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      receipt_type: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      transection_id: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      transection_description: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      no_of_entries: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
      tableName: "Vouchers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Vouchers.associate = (models) => {
    Vouchers.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Vouchers.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return Vouchers;
};

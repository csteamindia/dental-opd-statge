export default (sequelize, DataTypes) => {
  const Banks = sequelize.define(
    "Banks",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING(160),
        allowNull: true,
      },
      ac_no: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      ifsc_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      branch: {
        type: DataTypes.STRING(160),
        allowNull: true,
      },
      addrress: {
        type: DataTypes.STRING(320),
        allowNull: true,
      },
      ac_type: {
        type: DataTypes.ENUM("savings", "current"),
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
      tableName: "banks",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Banks.associate = (models) => {
    Banks.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Banks.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return Banks;
};

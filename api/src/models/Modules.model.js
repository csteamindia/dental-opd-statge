export default (sequelize, DataTypes) => {
  const Modules = sequelize.define(
    "Modules",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      module: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      _access: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "modules",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Modules;
};

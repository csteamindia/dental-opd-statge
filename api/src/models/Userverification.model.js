export default (sequelize, DataTypes) => {
  const Userverification = sequelize.define(
    "Userverification",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      _datetime: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      client_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ip_address: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    },
    {
      tableName: "user_verification",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Userverification;
};

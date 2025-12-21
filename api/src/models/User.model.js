export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      clinic_id: {
        type: DataTypes.STRING(128),
        defaultValue: null,
        allowNull: true,
      },
      client_id: {
        type: DataTypes.STRING(128),
        defaultValue: null,
        allowNull: true,
      },
      doc_code: {
        type: DataTypes.STRING(16),
        defaultValue: null,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(160),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mobile: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
      },
      is_verified: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "role",
      as: "user_role",
    });
    User.belongsTo(models.Userconfig, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "config",
    });
    User.hasMany(models.Clinics, {
      foreignKey: "id",
      sourceKey: "clinic_id",
    });
  };
  return User;
};

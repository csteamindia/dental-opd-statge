export default (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "Permission",
    {
      permission_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      clinic_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      module_name: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      is_accessable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_creatable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_readable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_writable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_deletable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_creatable_checkbox: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_readable_checkbox: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_writable_checkbox: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_deletable_checkbox: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "permissions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  //   Permission.associate = (models) => {

  // };
  Permission.associate = (models) => {
    Permission.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });
    Permission.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "role",
    });
    Permission.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return Permission;
};

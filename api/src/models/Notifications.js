export default (sequelize, DataTypes) => {
  const Notifications = sequelize.define(
    "Notifications",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      n_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      n_for: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      n_value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      n_status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      clinic_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      client_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      
      tableName: "Notifications",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Notifications.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return Notifications;
};

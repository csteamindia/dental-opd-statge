export default (sequelize, DataTypes) => {
  const Allergies = sequelize.define(
    "Allergies",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(160),
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
      tableName: "allergies",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Allergies.associate = (models) => {
    Allergies.hasOne(models.Clinics, {
      sourceKey: "clinic_id",
      foreignKey: "id",
      as: "clinic",
      constraints: false,
    });

    Allergies.hasOne(models.User, {
      foreignKey: "user_id",
      sourceKey: "client_id",
      as: "client",
      constraints: false,
    });
  };

  return Allergies;
};

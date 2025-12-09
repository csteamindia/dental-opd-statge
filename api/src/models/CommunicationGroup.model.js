export default (sequelize, DataTypes) => {
  const CommunicationGroup = sequelize.define(
    "CommunicationGroup",
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
      tableName: "communication_group",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  CommunicationGroup.associate = (models) => {
    CommunicationGroup.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    CommunicationGroup.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return CommunicationGroup;
};

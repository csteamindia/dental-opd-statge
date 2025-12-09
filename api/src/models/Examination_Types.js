export default (sequelize, DataTypes) => {
  const Examination_Types = sequelize.define(
    "Examination_Types",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
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
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "Examination_Types",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Examination_Types.associate = (models) => {
    Examination_Types.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Examination_Types.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return Examination_Types;
};

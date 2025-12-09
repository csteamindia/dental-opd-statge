export default (sequelize, DataTypes) => {
  const Doctors = sequelize.define(
    "Doctors",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(160),
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(320),
        allowNull: true,
      },
      registration_no: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      color_code: {
        type: DataTypes.STRING(26),
        allowNull: true,
      },
      signature: {
        type: DataTypes.TEXT,
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
      tableName: "doctors",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Doctors.associate = (models) => {
    Doctors.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Doctors.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });

    Doctors.belongsTo(models.User, {
      foreignKey: "mobile",
      targetKey: "mobile",
      as: "clientbymobile",
    });
  };

  return Doctors;
};

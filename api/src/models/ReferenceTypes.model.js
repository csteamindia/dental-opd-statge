// models/ReferenceTypes.model.js
import { Sequelize, DataTypes } from "sequelize"; // Import Sequelize here

export default (sequelize, DataTypes) => {
  const ReferenceTypes = sequelize.define(
    "ReferenceTypes",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(160),
      },
      clinic_id: {
        type: DataTypes.STRING(36),
      },
      client_id: {
        type: DataTypes.STRING(36),
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "referance_types",
      timestamps: false,
    }
  );
  
  ReferenceTypes.associate = (models) => {
    ReferenceTypes.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    ReferenceTypes.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return ReferenceTypes;
};

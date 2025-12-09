// models/FeedbackQuations.js
export default (sequelize, DataTypes) => {
  const FeedbackQuations = sequelize.define(
    "FeedbackQuations",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
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
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "feedback_quations",
      timestamps: false,
      underscored: true,
    }
  );
  FeedbackQuations.associate = (models) => {
    FeedbackQuations.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    FeedbackQuations.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return FeedbackQuations;
};

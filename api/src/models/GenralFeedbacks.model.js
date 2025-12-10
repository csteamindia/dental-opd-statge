// models/Feedback.js
export default (sequelize, DataTypes) => {
  const GeneralFeedback = sequelize.define(
    "GeneralFeedback",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(160),
      },
      contact: {
        type: DataTypes.STRING(18),
      },
      email: {
        type: DataTypes.STRING(320),
      },
      feedback: {
        type: DataTypes.STRING(400),
      },
      rating: {
        type: DataTypes.TINYINT,
      },
      client_id: {
        type: DataTypes.STRING(16),
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
      tableName: "genralfeedbacks",
      timestamps: false,
      underscored: true,
    }
  );
  GeneralFeedback.associate = (models) => {
    GeneralFeedback.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return GeneralFeedback;
};

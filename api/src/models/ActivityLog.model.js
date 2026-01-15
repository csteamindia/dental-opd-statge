export default (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define(
    "ActivityLog",
    {
      entity_type: DataTypes.STRING,
      entity_id: DataTypes.BIGINT,

      action: DataTypes.STRING,
      description: DataTypes.TEXT,

      old_data: DataTypes.JSON,
      new_data: DataTypes.JSON,

      performed_by: {
        type: DataTypes.STRING,
        defaultValue: "SYSTEM",
      },

      ip_address: DataTypes.STRING,
      user_agent: DataTypes.TEXT,
    },
    {
      tableName: "activity_logs",
      underscored: true,
      timestamps: true,
    }
  )

  return ActivityLog
}

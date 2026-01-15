export default (sequelize, DataTypes) => {
  const ScheduledNotification = sequelize.define(
    "ScheduledNotification",
    {
      notification_for: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      sent_to: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      scheduled_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      notification_type: {
        type: DataTypes.ENUM("EMAIL", "SMS", "WHATSAPP", "PUSH"),
        allowNull: false,
      },

      notification_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      notification_status: {
        type: DataTypes.ENUM(
          "PENDING",
          "PROCESSING",
          "SENT",
          "FAILED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },

      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      retry_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      max_retries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },

      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "scheduled_notifications",
      timestamps: true,
      underscored: true,
    }
  )

  return ScheduledNotification
}

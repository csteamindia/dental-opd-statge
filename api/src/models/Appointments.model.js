export default (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    "Appointment",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      doctor_code: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      appointment_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      chair_code: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      treatment_code: {
        type: DataTypes.STRING(16),
        allowNull: true,
        field: "tretment_code",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notification_status: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: false,
      },
      notification_for_patient: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: false,
        field: "notification_for_patinet",
      },
      notification_for_doctor: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: false,
      },
      appointment_valid: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      is_visited: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: false,
      },
      clinic_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      client_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      arravel_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      attened_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completed_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      index_position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      canceled_note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      canceled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      canceled_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "appointments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    Appointment.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
    Appointment.belongsTo(models.Patients, {
      foreignKey: "patient_id",
      targetKey: "id",
      as: "patient",
    });
    Appointment.belongsTo(models.Doctors, {
      foreignKey: "doctor_code",
      targetKey: "code",
      as: "doctor",
    });
  };

  return Appointment;
};

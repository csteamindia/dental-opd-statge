export default (sequelize, DataTypes) => {
  const DoctorTimings = sequelize.define('DoctorTimings', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    doctor_code: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    exe_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    clinic_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    client_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false
    }
  }, {
    tableName: 'doctor_timings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  DoctorTimings.associate = (models) => {
    DoctorTimings.belongsTo(models.Clinics, {
      foreignKey: 'clinic_id',
      targetKey: 'id',
      as: 'clinic',
    });

    DoctorTimings.belongsTo(models.User, {
      foreignKey: 'client_id',
      targetKey: 'user_id',
      as: 'client',
    });
    DoctorTimings.belongsTo(models.Doctors, {
      foreignKey: 'doctor_code',
      targetKey: 'code',
      as: 'doctor',
    });
  };

  return DoctorTimings;
};

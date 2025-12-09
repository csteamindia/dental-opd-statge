// models/clinics.js
export default (sequelize, DataTypes) => {
  const Clinics = sequelize.define(
    "Clinics",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      clinic_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      doctor_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(120),
        allowNull: true,
        unique: true,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      time_zone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      zip_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      client_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "clients",
          key: "user_id",
        },
      },
      is_default: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: true,
      },
      kiosk_code: {
        type: DataTypes.TEXT,
        defaultValue: 0,
        allowNull: true,
      },
      whatsapp: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: true,
      },
      wp_key: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      wp_sessionid: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      smtp: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: true,
      },
      smtp_username: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      smtp_password: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      smtp_port: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      smtp_encription: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      smtp_from_email: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      smtp_host: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },



      access_code: {
        type: DataTypes.TEXT,
        defaultValue: 0,
        allowNull: true,
      },
      clinic_url: {
        type: DataTypes.TEXT,
        defaultValue: 0,
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "clinics",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Clinics.associate = (models) => {
    Clinics.belongsTo(models.User, {
      foreignKey: "client_id",
      as: "client",
    });
    Clinics.belongsTo(models.Doctors, {
      foreignKey: "doctor_code",
      targetKey: "code",
      as: "doctors",
    });
  };
  return Clinics;
};

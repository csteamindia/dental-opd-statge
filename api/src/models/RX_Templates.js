export default (sequelize, DataTypes) => {
  const RX_Templates = sequelize.define(
    "RX_Templates",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      medicins: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      doctor_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      client_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      clinic_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "RX_Templates",
      timestamps: false,
    }
  );

  RX_Templates.associate = (models) => {
    RX_Templates.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    RX_Templates.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
    RX_Templates.belongsTo(models.Doctors, {
      foreignKey: "doctor_code",
      targetKey: "code",
      as: "doctor",
    });
    // RX_Templates.belongsTo(models.Mediciens, {
    //   foreignKey: "medicine_name",
    //   targetKey: "name",
    //   as: "Medicine",
    // });
    // RX_Templates.belongsTo(models.Prescription, {
    //   foreignKey: "prescription_id",
    //   targetKey: "id",
    //   as: "prescription",
    // });
  };

  return RX_Templates;
};

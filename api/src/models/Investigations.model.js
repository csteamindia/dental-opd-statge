// Investigation.model.js (using ES module syntax)

export default (sequelize, DataTypes) => {
  const Investigation = sequelize.define(
    "Investigation",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      temperature: {
        type: DataTypes.STRING,
      },
      blood_pressure: {
        type: DataTypes.STRING,
      },
      blood_sugar: {
        type: DataTypes.STRING,
      },
      auscultation: {
        type: DataTypes.STRING,
        comment: "OS (Other Sounds)",
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clinic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      doctor_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chief_complaint: {
        type: DataTypes.TEXT,
      },
      diagnosis_type: {
        type: DataTypes.STRING,
      },
      other_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      other_note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      tableName: "investigations",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )

  Investigation.associate = models => {
    Investigation.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    })
    Investigation.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    })

    Investigation.belongsTo(models.Patients, {
      foreignKey: "patient_id",
      targetKey: "id",
      as: "patient",
    })
    Investigation.belongsTo(models.Doctors, {
      foreignKey: "doctor_code",
      targetKey: "code",
      as: "doctor",
    })
    // Investigation.belongsTo(models.Examinations, {
    //   foreignKey: "examination_id",
    //   targetKey: "id",
    //   as: "examination",
    // });
  }

  return Investigation
}

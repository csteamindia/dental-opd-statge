'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Tretment extends Model {
    static associate(models) {
      // Define associations here
      Tretment.belongsTo(models.Doctors, {
        foreignKey: 'doctor_code',
        targetKey: 'code',
        as: 'doctor'
      });

      Tretment.hasMany(models.Patients, {
        foreignKey: 'id',
        targetKey: 'patient_id',
        as: 'patients'
      });

      Tretment.belongsTo(models.User, {
        foreignKey: 'client_id',
        as: 'client'
      });

      Tretment.belongsTo(models.Clinics, {
        foreignKey: 'clinic_id',
        as: 'clinic'
      });
      
      Tretment.hasMany(models.TretmentNotes, {
        foreignKey: 'treatment_id',
        // targetKey: 'treatment_id',
        as: 'notes'
      });
    }
  }

  Tretment.init({
    id: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    doctor_code: {
      type: DataTypes.STRING(26),
      allowNull: false
    },
    patient_id: {
      type: DataTypes.STRING(26),
      allowNull: false
    },
    treatment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    treatment_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tooths: {
      type: DataTypes.STRING,
      allowNull: true
    },
    treatment_status: {
      type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'discontinued'),
      allowNull: false,
      defaultValue: 'planned'
    },
    treatment_cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    treatment_total_cost: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    treatment_discount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    treatment_discount_type: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    treatment_note: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    is_billed: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    billed_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    client_id: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    clinic_id: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Tretment',
    tableName: 'treatment',
    timestamps: true,
    underscored: true
  });

  return Tretment;
};

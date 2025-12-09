// models/Mediciens.js
export default (sequelize, DataTypes) => {
  const Mediciens = sequelize.define('Mediciens', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(160),
    },
    molucule: {
      type: DataTypes.STRING(160),
    },
    dose: {
      type: DataTypes.STRING(16),
    },
    frequent: {
      type: DataTypes.STRING(16),
    },
    duration: {
      type: DataTypes.STRING(16),
    },
    is_fevrate: {
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
    allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'mediciens',
    timestamps: false,
    underscored: true,
  });

  Mediciens.associate = (models) => {
    Mediciens.belongsTo(models.Clinics, {
      foreignKey: 'clinic_id',
      targetKey: 'id',
      as: 'clinic',
    });

    Mediciens.belongsTo(models.User, {
      foreignKey: 'client_id',
      targetKey: 'user_id',
      as: 'client',
    });
  };

  return Mediciens;
};

export default (sequelize, DataTypes) => {
  const TretmentTypes = sequelize.define('TretmentTypes', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    cost: {
      type: DataTypes.STRING(16),
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
    },
  }, {
    tableName: 'tretment_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TretmentTypes.associate = (models) => {
    TretmentTypes.belongsTo(models.Clinics, {
      foreignKey: 'clinic_id',
      targetKey: 'id',
      as: 'clinic',
    });

    TretmentTypes.belongsTo(models.User, {
      foreignKey: 'client_id',
      targetKey: 'user_id',
      as: 'client',
    });
  };

  return TretmentTypes;
};

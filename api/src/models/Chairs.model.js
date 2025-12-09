export default (sequelize, DataTypes) => {
  const Chairs = sequelize.define('Chairs', {
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
    description: {
      type: DataTypes.STRING(260),
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
    cabin_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    intervel: {
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
    tableName: 'chairs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  Chairs.associate = (models) => {
    Chairs.belongsTo(models.Clinics, {
      foreignKey: 'clinic_id',
      targetKey: 'id',
      as: 'clinic',
    });

    Chairs.belongsTo(models.User, {
      foreignKey: 'client_id',
      targetKey: 'user_id',
      as: 'client',
    });
  };

  return Chairs;
};

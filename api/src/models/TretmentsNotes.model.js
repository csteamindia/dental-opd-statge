export default (sequelize, DataTypes) => {
  const TretmentNotes = sequelize.define('TretmentNotes', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    treatment_id: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    treatment_date: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    treatment_note: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    tooths: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
  }, {
    tableName: 'treatment_notes',
    timestamps: false
  });

  return TretmentNotes;
};

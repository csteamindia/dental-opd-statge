export default (sequelize, DataTypes) => {
  const DentalChartToothsExaminations = sequelize.define(
    "DentalChartToothsExaminations",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      group: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'group_'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clinic_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
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
      tableName: "dentalcharttoothsexaminations",
      timestamps: false, // we are manually managing created_at & updated_at
      underscored: true,
    }
  );
  DentalChartToothsExaminations.associate = (models) => {
    DentalChartToothsExaminations.belongsTo(models.Clinics, {
      foreignKey: "clinic_id",
      targetKey: "id",
      as: "clinic",
    });

    DentalChartToothsExaminations.belongsTo(models.User, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
  };

  return DentalChartToothsExaminations;
};
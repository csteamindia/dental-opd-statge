export default (sequelize, DataTypes) => {
  const Ttimelogs = sequelize.define(
    "Ttimelogs",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      app_id: {
        type: DataTypes.STRING,
      },
      // clinic_id: {
      //   type: DataTypes.STRING(36),
      //   allowNull: true,
      // },
      // client_id: {
      //   type: DataTypes.STRING(36),
      //   allowNull: true,
      // },
    },
    {
      tableName: "treatment_times",
      timestamps: false,
    }
  )

  return Ttimelogs
}

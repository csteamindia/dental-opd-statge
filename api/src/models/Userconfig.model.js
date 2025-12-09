export default (sequelize, DataTypes) => {
  const Userconfig = sequelize.define(
    "Userconfig",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      whastsapp: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      email: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      billing_info: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      covid_19: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      profile_pic: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      allergies: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      summary: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      follow_up: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      clinics: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
    },
    {
      tableName: "user_config",
      timestamps: false,
    }
  );
  return Userconfig;
};

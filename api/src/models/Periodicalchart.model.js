export default (sequelize, DataTypes) => {
    const Periodicalchart = sequelize.define(
      "Periodicalchart",
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        doctor_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        patient_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lower: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
        upper: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        status: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
        },
        client_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        clinic_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: "periodical_chart",
        timestamps: false,
        underscored: true,
      }
    );
   
    return Periodicalchart;
  };
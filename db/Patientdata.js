import { DataTypes } from "sequelize";

const Patientdata = (db) => {
  return db.define("patientdata", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientname: DataTypes.STRING,
    patientage: DataTypes.INTEGER,
    patientdateofbirth: DataTypes.INTEGER,
    bloodpressure: DataTypes.INTEGER,
    temperature: DataTypes.INTEGER,
    pulserate: DataTypes.INTEGER,
    oxygen: DataTypes.INTEGER,
    priority: DataTypes.INTEGER,
    estimatedwaittime: DataTypes.INTEGER,
    checkintime: DataTypes.INTEGER,
    estimatedwaittime: DataTypes.INTEGER,
  });
};

export default Patientdata;

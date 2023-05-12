import { Sequelize } from "sequelize";
import config from "../config";

const db = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: "mssql",
  logging: false,
});

export default db;

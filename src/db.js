import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false
});

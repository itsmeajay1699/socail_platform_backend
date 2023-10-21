import Sequelize from "sequelize";
import { config } from "dotenv";

config();

const PASSWORD = process.env.DATABASE_PASSWORD;
const HOST = process.env.DATABASE_HOST;
const USER = process.env.DATABASE_USER;
const DATABASE = process.env.DATABASE_NAME;
const dialect = "postgres";
const pool = {
  max: 100,
  min: 0,
  acquire: 60000,
  idle: 30000,
};

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect,
  pool,
  logging: false,
  benchmark: true,
  define: {
    paranoid: true,
    timestamp: true,
  },
});

export { Sequelize, sequelize };

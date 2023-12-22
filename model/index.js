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

// const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
//   host: "postgres://root:TP1QxrKIIx75lN1Cjk42yvRTibF9iyI0@dpg-cm0sjpmd3nmc73fkg5o0-a.singapore-postgres.render.com/social_media_postgres_database",
//   dialect,
//   pool,
//   logging: false,
//   benchmark: true,
//   define: {
//     paranoid: true,
//     timestamp: true,
//   },
// });

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export { Sequelize, sequelize };

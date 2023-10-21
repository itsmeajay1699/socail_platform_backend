import express from "express";

import bodyParser from "body-parser";

import { config } from "dotenv";

import { sequelize } from "./model/index.js";

config();

const app = express();

app.use(bodyParser.json());

// sequelize.sync({ force: true }).then(() => {
//   console.log("Database & tables created!");
// });

// routes
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("server is running on port http://localhost:3000");
});

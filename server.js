import express from "express";

import bodyParser from "body-parser";

import { config } from "dotenv";

import { sequelize } from "./model/index.js";

const { default: index } = await import("./routes/index.js");

import passport from "passport";

import User from "./model/schema/accounts/User.js";

import cookieParser from "cookie-parser";

import "./auth/passport_jwt.js";

import cors from "cors";

config();

const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

// sequelize.sync({ force: true }).then(() => {
//   console.log("Database & tables created!");
// });

// passport middleware

app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ------------------------------

// routes
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use("/api/v1", index);

app.listen(8080, () => {
  console.log("server is running on port http://localhost:3000");
});

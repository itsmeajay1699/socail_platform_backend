import express from "express";

import bodyParser from "body-parser";

import { config } from "dotenv";

import { sequelize } from "./model/index.js";

const { default: index } = await import("./routes/index.js");

import passport from "passport";

import User from "./model/schema/accounts/User.js";

import FriendRequest from "./model/schema/relations/FriendRequest.js";

import Post from "./model/schema/media/Post.js";

import cookieParser from "cookie-parser";

import PublicPost from "./model/schema/media/PublicPost.js";

import Story from "./model/schema/media/Story.js";

import "./auth/passport_jwt.js";

import cors from "cors";

import { setupWebSocketServer } from "./websocket/ws.js";

import http from "http";

config();

const app = express();

const server = http.createServer(app);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

sequelize.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
});

// passport middleware

app.use(passport.initialize());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// ------------------------------

// routes
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use("/api/v1", index);

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});

setupWebSocketServer(server);

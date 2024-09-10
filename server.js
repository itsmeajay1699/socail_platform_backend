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

import ChatRoom from "./model/schema/chat/ChatRoom.js";

import Messages from "./model/schema/chat/Message.js";
import "./utils/node-cron/cron.js";

import "./auth/passport_jwt.js";

import cors from "cors";

import { setupWebSocketServer } from "./websocket/ws.js";

import http from "http";

config();

const app = express();

const server = http.createServer(app);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

// sequelize.sync({ alter: true }).then(() => {
//   console.log("Database & tables created!");
// });

// passport middleware

app.use(passport.initialize());

// production
// app.use(
//   cors({
//     origin: "https://social-media-plateform.vercel.app",
//     credentials: true,
//   })
// );

// development

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://social-media-plateform.vercel.app",
  ],
  // You can add more options as needed
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"], // Specify the allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true,
};

app.use(cors(corsOptions));

// for trust the proxy causes error not setting cookies beacuse render provide a public domain

app.set("trust proxy", 1);

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

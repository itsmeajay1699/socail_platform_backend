import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import User from "../../model/schema/accounts/User.js";
const authRouter = Router();
import { config } from "dotenv";
import passport from "passport";
import { Sequelize, sequelize } from "../../model/index.js";

config();
const registerSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(8).max(100),
  email: z.string().email(),
  confirmPassword: z.string().min(8).max(100),
  // 1: user 2: admin 3: don
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, "body");
    // todo use becrpt to compare password

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: true, message: "invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: true, message: "invalid password" });
    }

    //  we can also add more details to the user

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const expiry = req.body?.remember
      ? { maxAge: 1000 * 60 * 60 * 24 * 2 }
      : {};

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        ...expiry,
      })
      .json({
        error: false,
        user: user,
        token: token,
        message: "Login successful",
      });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    console.log(req.signedCookies, "cookies");
    const registerData = registerSchema.safeParse(req.body);

    if (!registerData.success) {
      return res.status(400).json({ error: true, message: registerData.error });
    }

    const { username, password, email, role } = registerData.data;

    const userExists = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ username: username }, { email: email }],
      },
    });
    console.log(userExists, "userExists");
    if (userExists) {
      if (userExists.username == username) {
        return res
          .status(400)
          .json({ error: true, message: "Username already exists" });
      }
      if (userExists.email == email) {
        return res
          .status(400)
          .json({ error: true, message: "Email already exists" });
      }
    }

    const user = await User.create({
      username,
      password,
      email,
      role: 1,
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const expiry = req.body?.remember
      ? { maxAge: 1000 * 60 * 60 * 24 * 2 }
      : {};

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        ...expiry,
      })
      .json({
        error: false,
        user: user,
        token: token,
        message: "Login successful",
      });

    // const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    // const expiry = req.body?.remember
    //   ? { maxAge: 1000 * 60 * 60 * 24 * 2 }
    //   : {};

    // return res
    //   .status(200)
    //   .cookie("token", token, {
    //     httpOnly: true,
    //     secure: false,
    //     signed: true,
    //     ...expiry,
    //   })
    //   .json({
    //     error: false,
    //     user: user,
    //     token: token,
    //     message: "Login successful",
    //   });
  } catch (err) {
    console.log(err.message, "err");
    return res.status(500).json({ error: true, message: err.message });
  }
});

authRouter.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res
      .status(200)
      .json({ error: false, message: "Logged in", user: req.user });
  }
);

authRouter.get("/logout", (req, res) => {
  console.log(res)
  res.clearCookie("token");
  res.status(200).json({ error: false, message: "Logged out" });
});

export default authRouter;

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
  role: z.number().min(1).max(3),
  // 1: user 2: admin 3: don
});

authRouter.post(
  "/login",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { username, password, email, role } = req.user;

      const token = jwt.sign(
        { username, password, email, role },
        process.env.JWT_SECRET
      );

      return res.status(200).json({ error: false, user: req.user, token });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
);

authRouter.post("/register", async (req, res) => {
  try {
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
      role,
    });

    const token = jwt.sign(
      { username, password, email, role },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ error: false, user, token });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
});

export default authRouter;

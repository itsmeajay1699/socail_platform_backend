import { Router } from "express";
import { z } from "zod";
import { config } from "dotenv";
import { Sequelize } from "../../model/index.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../../model/schema/accounts/User.js";

const router = Router();

config();

const UserSchema = z.object({
  username: z.string().min(1).max(30),
  password: z.string().min(8).max(16),
  email: z.string().min(1).max(255).email(),
  role: z.number().min(1).max(5),
  profile_photo: z.string().min(1).max(255),
  full_name: z.string().min(1).max(255),
  phone_number: z.string().min(1).max(255),
  bio: z.string().nullable(),
});

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    console.log(user, "user");
    if (!user) {
      return res.status(401).json({ error: true, message: "invalid email" });
    }

    return res.status(200).json({
      error: false,
      user,
    });
  }
);

router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const findUser = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!findUser) {
      return res.status(401).json({ error: true, message: "invalid email" });
    }

    const checkUserWithEmail = await User.findOne({
      where: {
        email: req.body.email,
        id: {
          [Sequelize.Op.not]: req.user.id,
        },
      },
    });

    if (checkUserWithEmail) {
      return res
        .status(401)
        .json({ error: true, message: "Email already exists" });
    }

    Object.keys(req.body).forEach((key) => {
      if (
        req.body[key] === "" ||
        req.body[key] === null ||
        !req.body[key] ||
        req.body[key] === undefined
      ) {
        delete req.body[key];
      }
    });

    await findUser.update({ ...req.body });

    return res.status(200).json({
      error: false,
      message: "Update successful",
      findUser,
    });
  }
);

router.get(
  "/getUsers/:search",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.params.search, "req.params.search");

    const users = await User.findAll({
      where: {
        username: {
          [Sequelize.Op.like]: `${req.params.search}%`, // in this case, the search string must be at the beginning of the username
          // [Sequelize.Op.like]: `%${req.params.search}%`, // % means any character before or after the search string
        },
        id: {
          [Sequelize.Op.not]: req.user.id,
        },
      },
    });

    console.log(users, "users");

    return res.status(200).json({
      error: false,
      users,
      message: "Get users success",
    });
  }
);

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.send({
    message: "Verify Success",
    decoded,
  });
});

export default router;

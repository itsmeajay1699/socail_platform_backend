import { Router } from "express";
import { z } from "zod";
import { config } from "dotenv";

import jwt from "jsonwebtoken";

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

router.get("/", function (req, res) {
  res.send("User Route");
});

router.post("/register", async (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (result.success === false) return res.status(400).send(result.error);
  const token = jwt.sign({}, process.env.JWT_SECRET);

  res.send({
    message: "Register Success",
    token,
  });
});

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.send({
    message: "Verify Success",
    decoded,
  });
});

export default router;

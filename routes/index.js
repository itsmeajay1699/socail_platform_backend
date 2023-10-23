import { Router } from "express";

const { default: user } = await import("./account/user.js");

const { default: authRouter } = await import("./auth/auth.js");

const router = Router();

router.use("/user", user);

router.use("/auth", authRouter);

export default router;

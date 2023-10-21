import { Router } from "express";

const { default: user } = await import("./account/user.js");

const router = Router();

router.use("/user", user);

export default router;
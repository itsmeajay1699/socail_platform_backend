import { Router } from "express";

const router = Router();

router.get("/", function (req, res) {
  res.send("User Route");
});

export default router;

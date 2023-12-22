import { Router } from "express";

const { default: user } = await import("./account/user.js");

const { default: authRouter } = await import("./auth/auth.js");

const { default: relationRouter } = await import("./relation/relation.js");

const { default: postRouter } = await import("./media/post.js");

const { default: publicPostRouter } = await import("./media/PublicPost.js");

const { default: storyRouter } = await import("./media/Story.js");

const router = Router();

router.use("/user", user);

router.use("/auth", authRouter);

router.use("/relation", relationRouter);

router.use("/post", postRouter);

router.use("/publicpost", publicPostRouter);

router.use("/story", storyRouter);

export default router;

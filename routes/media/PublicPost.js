import { Router } from "express";
import PublicPost from "../../model/schema/media/PublicPost.js";
import Post from "../../model/schema/media/Post.js";
import User from "../../model/schema/accounts/User.js";

const publicPostRouter = Router();

// to show the content on the feed page of the user means every public post of the user
publicPostRouter.get("/", async (req, res) => {
  try {
    const allPublicPost = await PublicPost.findAll({
      include: [
        {
          model: Post,
          as: "post",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "profile_photo"],
            },
          ],
        },
      ],
    });

    return res.send({
      error: false,
      message: "All public post",
      allPublicPost,
    });
  } catch (err) {
    console.log(err);
  }
});

export default publicPostRouter;

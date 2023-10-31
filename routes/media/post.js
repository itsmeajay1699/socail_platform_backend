import { Router } from "express";
import passport from "passport";
import { z } from "zod";
import Post from "../../model/schema/media/Post.js";
import PublicPost from "../../model/schema/media/PublicPost.js";
import User from "../../model/schema/accounts/User.js";
import FriendRequest from "../../model/schema/relations/FriendRequest.js";
const postRouter = Router();

const postSchema = z.object({
  privacy: z.enum(["public", "private", "friends"]),
  about: z.string(),
  media: z.string(),
});

postRouter.get("/", async (req, res) => {
  res.send("post");
});

postRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.user;
    console.log(req.body);
    console.log(id, "user");
    const safedata = postSchema.safeParse(req.body);
    if (!safedata.success)
      return res
        .status(400)
        .json({ error: true, message: "Error in format data" });

    const post = await Post.create({
      user_id: id,
      ...safedata.data,
    });
    let newEntryInPublictable = undefined;
    if (safedata.data.privacy === "public") {
      newEntryInPublictable = await PublicPost.create({
        post_id: post.post_id,
      });
    }

    if (!post)
      return res
        .status(400)
        .json({ error: true, message: "Error in creating post" });

    return res.status(200).json({
      error: false,
      message: "Post created",
      post,
      newEntryInPublictable,
    });
  }
);

postRouter.get(
  "/friend-post",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;

      const friendPostSend = await FriendRequest.findAll({
        attributes: ["id"],
        where: {
          sender_id: id,
          status: 1,
        },

        include: [
          {
            model: User,
            as: "receiver",
            attributes: ["id", "username", "profile_photo"],
            include: [
              {
                model: Post,
                as: "posts",
                attributes: [
                  "post_id",
                  "about",
                  "media",
                  "likes_count",
                  "comments_count",
                  "like_user_id",
                ],
              },
            ],
          },
        ],
      });
      const friendPostRecieved = await FriendRequest.findAll({
        attributes: ["id"],
        where: {
          receiver_id: id,
          status: 1,
        },

        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "username", "profile_photo"],
            include: [
              {
                model: Post,
                as: "posts",
                attributes: [
                  "post_id",
                  "about",
                  "media",
                  "likes_count",
                  "comments_count",
                  "like_user_id",
                ],
              },
            ],
          },
        ],
      });

      const friendPost = [...friendPostSend, ...friendPostRecieved];

      return res.status(200).json({
        error: false,
        message: "Friend post",
        friendPost,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// my all post

postRouter.get(
  "/my-post",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;

      const myPost = await Post.findAll({
        where: {
          user_id: id,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });

      return res.status(200).json({
        error: false,
        message: "My post",
        myPost,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

postRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;
      const { id: post_id } = req.params;

      const post = await Post.findOne({
        where: {
          post_id,
          user_id: id,
        },
      });

      if (!post)
        return res.status(400).json({ error: true, message: "Post not found" });

      await post.destroy();

      const publicPost = await PublicPost.findOne({
        where: {
          post_id,
        },
      });

      if (publicPost) {
        await publicPost.destroy();
      }

      return res.status(200).json({
        error: false,
        message: "Post deleted",
      });
    } catch (err) {
      console.log(err);
    }
  }
);

postRouter.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id: post_id } = req.params;
      const { id: user_id } = req.user;

      const post = await Post.findOne({
        where: {
          post_id,
        },
      });

      if (!post) {
        return res.status(400).json({ error: true, message: "Post not found" });
      }

      if (post.like_user_id.includes(user_id)) {
        return res.status(400).json({ error: true, message: "Already liked" });
      }

      const like = await post.update({
        like_user_id: [...post.like_user_id, user_id],
        likes_count: post.likes_count + 1,
      });

      return res.status(200).json({
        error: false,
        message: "Post liked",
        like,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

export default postRouter;

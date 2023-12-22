// import { sequelize, Sequelize } from "../../index.js";
// import User from "../accounts/User.js";
// const Story = sequelize.define("story", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   user_id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   media_url: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   media_type: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// User.hasMany(Story, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
// });
// Story.belongsTo(User, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
// });

// Story.sync({ force: false }).then(() => {
//   console.log("Story table created");
// });

// export default Story;

// import { Sequelize, sequelize } from "../../index.js";
// import User from "../accounts/User.js";
// const FriendRequest = sequelize.define(
//   "friend_request",
//   {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     sender_id: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//     },
//     receiver_id: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//     },
//     status: {
//       type: Sequelize.INTEGER, // 0: pending, 1: accepted, 2: rejected // default 0
//       allowNull: false,
//       defaultValue: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// User.hasMany(FriendRequest, {
//   foreignKey: "sender_id",
//   as: "sender",
// });

// User.hasMany(FriendRequest, {
//   foreignKey: "receiver_id",
//   as: "receiver",
// });

// FriendRequest.belongsTo(User, {
//   foreignKey: "sender_id",
//   as: "sender",
// });

// FriendRequest.belongsTo(User, {
//   foreignKey: "receiver_id",
//   as: "receiver",
// });

// // FriendRequest.sync().then(() => {
// //   console.log("FriendRequest table created");
// // });

// export default FriendRequest;

import { Router } from "express";
import passport from "passport";
import Story from "../../model/schema/media/Story.js";
import { Sequelize, sequelize } from "../../model/index.js";
import User from "../../model/schema/accounts/User.js";

const storyRouter = Router();

storyRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.user);
      const { id } = req.user;
      const { media_url, media_type } = req.body;
      console.log(id);
      const story = await Story.create({
        user_id: id,
        media_url,
        media_type,
      });

      return res.status(200).json({ error: false, story });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }
);

storyRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;

      const story = await Story.findOne({
        where: {
          id,
        },
      });

      if (!story) {
        return res
          .status(404)
          .json({ error: true, message: "Story does not exist" });
      }

      if (story.user_id !== user.id) {
        return res
          .status(401)
          .json({ error: true, message: "Unauthorized to delete story" });
      }

      await story.destroy();

      return res
        .status(200)
        .json({ error: false, message: "Story deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }
);

storyRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const friendStory = await Story.findAll({
        where: {
          user_id: {
            [Sequelize.Op.in]: [
              sequelize.literal(`SELECT sender_id from friend_requests WHERE receiver_id = ${user.id} AND status = 1
                    UNION
                    SELECT receiver_id from friend_requests WHERE sender_id = ${user.id} AND status = 1`),
            ],
          },
        },
        include: [
          {
            model: User,
            as: "story_user", // Use the alias defined in the association
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });

      //   const friendStory = await sequelize.query(
      //     `
      //     SELECT * from stories WHERE user_id IN (
      //         SELECT sender_id from friend_requests WHERE receiver_id = ${user.id} AND status = 1
      //         UNION
      //         SELECT receiver_id from friend_requests WHERE sender_id = ${user.id} AND status = 1
      //         )
      //     `
      //   );

      return res.status(200).json({ error: false, friendStory });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }
);

export default storyRouter;

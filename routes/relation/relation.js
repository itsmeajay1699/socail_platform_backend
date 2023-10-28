import { Router } from "express";
import passport from "passport";
import FriendRequest from "../../model/schema/relations/FriendRequest.js";
import User from "../../model/schema/accounts/User.js";
const relationRouter = Router();

relationRouter.get("/", async (req, res) => {
  res.send("Hello World");
});

relationRouter.post(
  "/friend-request",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const sender_id = req.user.id;
      const { receiver_id } = req.body;
      console.log(sender_id, receiver_id);
      const friendRequest = await FriendRequest.findOrCreate({
        where: {
          sender_id,
          receiver_id,
        },
        defaults: {
          sender_id,
          receiver_id,
        },
      });

      res.send({
        error: false,
        friendRequest,
      });
    } catch (err) {
      res.send({
        error: true,
        message: err.message,
      });
    }
  }
);

relationRouter.patch("/update", async (req, res) => {
  try {
    // 0 pending 1 accepted 2 rejected
    const { id, status } = req.body;
    console.log(id, status);
    const friendRequest = await FriendRequest.findOne({
      where: {
        id,
      },
    });
    if (status === 2) {
      await friendRequest.destroy();
      return res.send({
        error: false,
        message: "Friend request deleted",
      });
    }
    friendRequest.status = status;
    await friendRequest.save();
    return res.send({
      error: false,
      friendRequest,
      message: "Friend request accepted",
    });
  } catch (err) {
    res.send({
      error: true,
      message: err.message,
    });
  }
});

relationRouter.get(
  "/friend-request/received",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;
      const friendRequests = await FriendRequest.findAll({
        where: {
          receiver_id: id,
          status: 0,
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });
      res.send({
        error: false,
        friendRequests,
      });
    } catch (err) {
      res.send({
        error: true,
        message: err.message,
      });
    }
  }
);

relationRouter.get(
  "/friend-request/sent",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;
      const friendRequests = await FriendRequest.findAll({
        where: {
          sender_id: id,
          status: 0,
        },
        include: [
          {
            model: User,
            as: "receiver",
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });
      res.send({
        error: false,
        friendRequests,
      });
    } catch (err) {
      res.send({
        error: true,
        message: err.message,
      });
    }
  }
);

relationRouter.get(
  "/friend-request/accepted",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;
      const friendsBySent = await FriendRequest.findAll({
        where: {
          sender_id: id,
          status: 1,
        },
        include: [
          {
            model: User,
            as: "receiver",
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });

      const friendsByReceived = await FriendRequest.findAll({
        where: {
          receiver_id: id,
          status: 1,
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });

      const friends = [...friendsBySent, ...friendsByReceived];

      res.send({
        error: false,
        friends,
      });
    } catch (err) {
      res.send({
        error: true,
        message: err.message,
      });
    }
  }
);

export default relationRouter;

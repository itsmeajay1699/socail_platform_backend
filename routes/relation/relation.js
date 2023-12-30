import { Router } from "express";
import passport from "passport";
import FriendRequest from "../../model/schema/relations/FriendRequest.js";
import User from "../../model/schema/accounts/User.js";
import ChatRoom from "../../model/schema/chat/ChatRoom.js";
import { Sequelize, sequelize } from "../../model/index.js";
import Messages from "../../model/schema/chat/Message.js";
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
      // console.log(sender_id, receiver_id,"hello world");

      const find = await FriendRequest.findOne({
        where: {
          [Sequelize.Op.or]: [
            { sender_id, receiver_id },
            { sender_id: receiver_id, receiver_id: sender_id },
          ],
        },
      });

      console.log(find, "hello world");

      if (find) {
        return res.send({
          error: true,
          message: "Friend request already sent",
        });
      }

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
      await friendRequest.destroy(
        {
          where: {
            id,
          },
        },
        { force: true } //
      );
      return res.send({
        error: false,
        message: "Friend request deleted",
      });
    }
    friendRequest.status = status;
    const updateRelation = await friendRequest.save();
    // creating the room here after the friends request is accepted

    if (!updateRelation) {
      return res.send({
        error: true,
        message: "error in accepting the request try again",
      });
    }

    // create the room here with both the user id

    const creatingChatRoom = await ChatRoom.create({
      user_id_1: friendRequest.sender_id,
      user_id_2: friendRequest.receiver_id,
    });

    if (!creatingChatRoom) {
      return res.send({
        error: true,
        message: "error in creating the chat room between the user",
      });
    }

    return res.send({
      error: false,
      friendRequest,
      message: "Friend request accepted",
      ChatRoom,
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

// chat roos changes here
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

relationRouter.get(
  "/all/chat_rooms",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;
      console.log(id, "hello world meri di hai bhhai ye");

      const chatRooms = await ChatRoom.findAll(
        {
          where: {
            [Sequelize.Op.or]: [{ user_id_1: id }, { user_id_2: id }],
          },
          attributes: ["id", "user_id_1", "user_id_2", "last_message_id","updatedAt"],
          include: [
            {
              model: User,
              as: "user_1",
              attributes: ["id", "username", "profile_photo"],
            },
            {
              model: User,
              as: "user_2",
              attributes: ["id", "username", "profile_photo"],
            },
            {
              model: Messages,
              as: "last_message",
            },
          ],
        },
        {
          order: [["updatedAt", "DESC"]], // latest message at the top
        }
      );

      console.log(chatRooms.dataValues, "hello world");

      res.send({
        error: false,
        chatRooms,
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

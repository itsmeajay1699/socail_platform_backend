import { Router } from "express";

const chatRouter = Router();

import passport from "passport";
import Messages from "../../model/schema/chat/Message.js";
import User from "../../model/schema/accounts/User.js";
import { activeConnections } from "../../websocket/ws.js";
import ChatRoom from "../../model/schema/chat/ChatRoom.js";

chatRouter.get(
  "/messages/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id, "hello world");
      const messages = await Messages.findAll({
        where: {
          chat_room_id: id,
        },
        include: [
          {
            model: User,
            as: "user_messages",
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });
      res.send({
        error: false,
        messages,
      });
    } catch (err) {
      res.send({
        error: true,
        message: err.message,
      });
    }
  }
);

chatRouter.post(
  "/send-message",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body, "hello world");
      const { chatRoom, message } = req.body;
      const { id } = req.user;

      const chatRoomPeople = await ChatRoom.findOne({
        where: {
          id: chatRoom,
        },
      });

      let receiverId = null;

      if (chatRoomPeople.user_id_1 === id) {
        receiverId = chatRoomPeople.user_id_2;
      }

      if (chatRoomPeople.user_id_2 === id) {
        receiverId = chatRoomPeople.user_id_1;
      }

      const newMessage = await Messages.create({
        sender_id: id,
        chat_room_id: chatRoom,
        content: message,
      });

      const messageToSend = await Messages.findOne({
        where: {
          id: newMessage.id,
        },
        include: [
          {
            model: User,
            as: "user_messages",
            attributes: ["id", "username", "profile_photo"],
          },
        ],
      });

      let newChatRoom = await ChatRoom.update(
        {
          last_message_id: newMessage.id,
        },
        {
          where: {
            id: chatRoom,
          },
        }
      );

      newChatRoom = await ChatRoom.findOne({
        where: {
          id: chatRoom,
        },
        attributes: ["id", "user_id_1", "user_id_2", "last_message_id"],
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
      });

      const receiverConnection = activeConnections[receiverId];
      console.log(messageToSend.dataValues, "messageToSend");
      if (receiverConnection) {
        receiverConnection.send(
          JSON.stringify({
            type: "message",
            message: messageToSend["dataValues"],
            newChatRoom,
            // chatRoom: chatRoom,
            // user_id: id,
          })
        );
      }
      res.send({
        error: false,
        message: messageToSend,
        newChatRoom,
      });
    } catch (err) {
      res.send({
        error: true,
        message: err.message,
      });
    }
  }
);

export default chatRouter;

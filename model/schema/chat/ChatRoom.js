import { Sequelize, sequelize } from "../../index.js";
import User from "../accounts/User.js";
import Messages from "./Message.js";
const ChatRoom = sequelize.define(
  "chat_room",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id_1: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id_2: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    last_message_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(ChatRoom, {
  foreignKey: "user_id_1",
  as: "user_1",
});

ChatRoom.belongsTo(Messages, {
  foreignKey: "last_message_id",
  as: "last_message",
});
Messages.belongsTo(ChatRoom, {
  foreignKey: "id",
  as: "last_message",
  targetKey: "last_message_id",
});

User.hasMany(ChatRoom, {
  foreignKey: "user_id_2",
  as: "user_2",
});

ChatRoom.belongsTo(User, {
  foreignKey: "user_id_1",
  as: "user_1",
});

ChatRoom.belongsTo(User, {
  foreignKey: "user_id_2",
  as: "user_2",
});

ChatRoom.hasMany(Messages, {
  foreignKey: "chat_room_id",
  as: "room_messages",
});

Messages.belongsTo(ChatRoom, {
  foreignKey: "chat_room_id",
  as: "room_messages",
});

export default ChatRoom;

import { sequelize, Sequelize } from "../../index.js";
import ChatRoom from "./ChatRoom.js";
import User from "../accounts/User.js";
const Messages = sequelize.define(
  "chat_room_message",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    chat_room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    media: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timeStamps: true,
  }
);



User.hasMany(Messages, {
  foreignKey: "sender_id",
  as: "user_messages",
});

Messages.belongsTo(User, {
  foreignKey: "sender_id",
  as: "user_messages",
});





export default Messages;

import { Sequelize, sequelize } from "../../index.js";
import User from "../accounts/User.js";
const FriendRequest = sequelize.define(
  "friend_request",
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
    receiver_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER, // 0: pending, 1: accepted, 2: rejected // default 0
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(FriendRequest, {
  foreignKey: "sender_id",
  as: "sender",
});

User.hasMany(FriendRequest, {
  foreignKey: "receiver_id",
  as: "receiver",
});

FriendRequest.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});

FriendRequest.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "receiver",
});

// FriendRequest.sync().then(() => {
//   console.log("FriendRequest table created");
// });

export default FriendRequest;

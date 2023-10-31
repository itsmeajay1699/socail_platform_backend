import { Sequelize, sequelize } from "../../index.js";
import User from "../accounts/User.js";

const Post = sequelize.define("post", {
  post_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    // jwt through
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  about: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  media: {
    // photo, video, audio, document
    type: Sequelize.STRING,
  },

  privacy: {
    type: Sequelize.ENUM("public", "private", "friends"),
    allowNull: false,
  },

  likes_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  comments_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },

  like_user_id: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: [],
  },
});

Post.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  targetKey: "id",
});

User.hasMany(Post, {
  foreignKey: "user_id",
  as: "posts",
  targetKey: "id",
});

// Post.sync({ alter: true });

export default Post;

import { Sequelize, sequelize } from "../../index.js";
import User from "../accounts/User.js";
import Post from "../media/Post.js";
const PublicPost = sequelize.define("public_post", {
  public_post_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  post_id: {
    // jwt through
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

PublicPost.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post",
  targetKey: "post_id",
});

Post.hasOne(PublicPost, {
  foreignKey: "post_id",
  as: "public_post",
  targetKey: "post_id",
});

// PublicPost.belongsTo(User, {
//   foreignKey: "user_id",
//   as: "user",
//   targetKey: "id",
// });

// PublicPost.sync({ force: true });

export default PublicPost;

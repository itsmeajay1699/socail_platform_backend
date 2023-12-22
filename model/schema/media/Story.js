import { sequelize, Sequelize } from "../../index.js";
import User from "../accounts/User.js";
const Story = sequelize.define("story", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  media_url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  media_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.hasMany(Story, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  as: "stories",
});
Story.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  as: "story_user",
});

// Story.sync({ alter: false }).then(() => {
//   console.log("Story table created");
// });

export default Story;

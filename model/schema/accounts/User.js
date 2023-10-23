import { Sequelize, sequelize } from "../../index.js";

const User = sequelize.define("user_account", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [8, 16],
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  profile_photo: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "https://i.imgur.com/6VBx3io.png",
  },
  full_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone_number: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bio: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

export default User;

// User.sync({ force: true }).then(() => {
//   console.log("Database & tables created!");
// });

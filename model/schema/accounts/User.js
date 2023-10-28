import { Sequelize, sequelize } from "../../index.js";

const User = sequelize.define("user_account", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    // form
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    // form
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [8, 16],
    },
  },
  email: {
    // form
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    // form default 1 - user
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  profile_photo: {
    type: Sequelize.STRING, // default but can be updated later
    allowNull: false,
    defaultValue: "https://i.imgur.com/6VBx3io.png",
  },
  full_name: {
    // profile form
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone_number: {
    // profile form
    type: Sequelize.STRING,
    allowNull: true,
  },
  bio: {
    // profile form
    type: Sequelize.STRING,
    allowNull: true,
  },
});

export default User;

// User.sync({ force: true }).then(() => {
//   console.log("Database & tables created!");
// });

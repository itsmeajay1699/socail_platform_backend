import { Sequelize, sequelize } from "../index.js";

const Ajay = sequelize.define("Ajay", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
});

export default Ajay;

// Ajay.sync({ force: true }).then(() => {
//   console.log("Database & tables created!");
// });

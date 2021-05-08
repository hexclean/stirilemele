const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const UserProfile = sequelize.define("UserProfile", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = UserProfile;

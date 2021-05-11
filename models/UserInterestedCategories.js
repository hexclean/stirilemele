const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const UserInterestedCategories = sequelize.define("UserInterestedCategories", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.INTEGER,
});

module.exports = UserInterestedCategories;

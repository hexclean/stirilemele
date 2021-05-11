const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const UserInterestedSources = sequelize.define("UserInterestedSources", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.INTEGER,
});

module.exports = UserInterestedSources;

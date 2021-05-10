const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ArticleAction = sequelize.define("ArticleAction", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  like: Sequelize.INTEGER,
  love: Sequelize.INTEGER,
  dislike: Sequelize.INTEGER,
});

module.exports = ArticleAction;

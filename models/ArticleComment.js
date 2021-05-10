const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ArticleComment = sequelize.define("ArticleComment", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  comment: Sequelize.TEXT("long"),
});

module.exports = ArticleComment;

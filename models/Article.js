const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Article = sequelize.define("Article", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  imageUrl: {
    type: Sequelize.TEXT("long"),
  },
  link: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  title: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  timeCreated: Sequelize.DATE,
});

module.exports = Article;

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const News = sequelize.define("News", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  imageUrl: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  href: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  title: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
});

module.exports = News;

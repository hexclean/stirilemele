const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ArticleViewed = sequelize.define("ArticleViewed", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  operation: Sequelize.INTEGER,
});

module.exports = ArticleViewed;

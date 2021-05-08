const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const CategoryTranslation = sequelize.define("CategoryTranslation", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
});

module.exports = CategoryTranslation;

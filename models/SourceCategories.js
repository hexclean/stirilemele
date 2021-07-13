const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const SourceCategories = sequelize.define("SourceCategories", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  prim: Sequelize.INTEGER,
});

module.exports = SourceCategories;

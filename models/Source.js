const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Source = sequelize.define("Source", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  seoUrl: Sequelize.STRING,
});

module.exports = Source;

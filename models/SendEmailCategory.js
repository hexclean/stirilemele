const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const SendEmailCategory = sequelize.define("SendEmailCategory", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.INTEGER,
});

module.exports = SendEmailCategory;

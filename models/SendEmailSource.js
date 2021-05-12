const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const SendEmailSource = sequelize.define("SendEmailSource", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.INTEGER,
});

module.exports = SendEmailSource;

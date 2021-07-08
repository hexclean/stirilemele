const Sequelize = require("sequelize");
const db = {};

sequelize = new Sequelize("defaultdb", "doadmin", "ldms569jnww55d68", {
  host: "db-mysql-fra1-95468-do-user-9247906-0.b.db.ondigitalocean.com",
  dialect: "mysql",
  port: 25060,
});
// sequelize = new Sequelize("stirilemele", "root", "", {
//   host: "",
//   dialect: "mysql",
//   operatorsAliases: false,
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = sequelize;

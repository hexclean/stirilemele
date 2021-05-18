const Sequelize = require("sequelize");
const db = {};

sequelize = new Sequelize("defaultdb", "doadmin", "hhifjal25po3olfs", {
  dialect: "mysql",
  host: "stirilemele-do-user-9247906-0.b.db.ondigitalocean.com",
  port: 25060,
});

// sequelize = new Sequelize("defaultdb", "doadmin", "uzg7vmow9hgs0dlw", {
//   dialect: "mysql",
//   host: "staging-db-do-user-8133521-0.b.db.ondigitalocean.com",
//   port: 25060,
// });

// sequelize = new Sequelize("stirilemele", "root", "", {
//   host: "",
//   dialect: "mysql",
//   operatorsAliases: false,
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = sequelize;

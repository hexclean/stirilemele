const { users } = require("./database/Users");


function databaseConfig() {
  users();
  
}

module.exports = { databaseConfig };

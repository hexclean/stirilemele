const Users = require("../../models/Users");
const UserProfile = require("../../models/UserProfile");

function users() {
  UserProfile.belongsTo(Users, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "userId",
  });
  Users.hasOne(UserProfile, { foreignKey: "userId" });
}

module.exports = { users };

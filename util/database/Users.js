const Users = require("../../models/Users");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");
const Category = require("../../models/Category");
const Language = require("../../models/Language");
const Article = require("../../models/Article");
const Source = require("../../models/Source");
const CategoryTranslation = require("../../models/CategoryTranslation");

function users() {
  //
  UserInterestedCategories.belongsTo(Users, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "userId",
  });
  Users.hasMany(UserInterestedCategories, { foreignKey: "userId" });
  //
  UserInterestedSources.belongsTo(Source, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "sourceId",
  });
  Source.hasMany(UserInterestedSources, { foreignKey: "sourceId" });
  //
  UserInterestedCategories.belongsTo(Category, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "categoryId",
  });
  Category.hasMany(UserInterestedCategories, { foreignKey: "categoryId" });
  //
  UserInterestedSources.belongsTo(Users, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "userId",
  });
  Users.hasMany(UserInterestedSources, { foreignKey: "userId" });
  //
  CategoryTranslation.belongsTo(Language, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "languageId",
  });
  Language.hasMany(CategoryTranslation, { foreignKey: "languageId" });
  //
  CategoryTranslation.belongsTo(Category, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "categoryId",
  });
  Category.hasMany(CategoryTranslation, { foreignKey: "categoryId" });
  //
  UserInterestedCategories.belongsTo(UserInterestedSources, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "userInterestedSourcesId",
  });
  UserInterestedSources.hasMany(UserInterestedCategories, {
    foreignKey: "userInterestedSourcesId",
  });
  //
  Article.belongsTo(Language, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "languageId",
  });
  Language.hasMany(Article, { foreignKey: "languageId" });
  //
  Article.belongsTo(Category, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "categoryId",
  });
  Category.hasMany(Article, { foreignKey: "categoryId" });
  //
  Article.belongsTo(Source, {
    constrains: true,
    onDelete: "CASCADE",
    foreignKey: "sourceId",
  });
  Source.hasMany(Article, { foreignKey: "sourceId" });
}

module.exports = { users };

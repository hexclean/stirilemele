const Source = require("../../models/Source");
const Category = require("../../models/Category");
const SourceCategories = require("../../models/SourceCategories");
const CategoryTranslation = require("../../models/CategoryTranslation");
const Articles = require("../../models/Article");

exports.getProfile = async (req, res, next) => {
  res.render("profile/index", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.getSendEmailEndOfTheDay = async (req, res, next) => {
  const categories = await Category.findAll({
    include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  });

  const channels = await Source.findAll();

  res.render("profile/emailEndOfDay", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
    channels: channels,
  });
};

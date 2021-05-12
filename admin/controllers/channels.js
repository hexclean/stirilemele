const Source = require("../../models/Source");
const Category = require("../../models/Category");
const SourceCategories = require("../../models/SourceCategories");
const CategoryTranslation = require("../../models/CategoryTranslation");

exports.getAllChannel = async (req, res, next) => {
  const source = await Source.findAll();

  res.render("source/AllChannels", {
    path: "/login",
    pageTitle: "Login",
    source: source,
  });
};

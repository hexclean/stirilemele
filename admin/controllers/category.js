const Source = require("../../models/Source");
const Category = require("../../models/Category");
const SourceCategories = require("../../models/SourceCategories");
const CategoryTranslation = require("../../models/CategoryTranslation");

exports.getAllCategoryScreen = async (req, res, next) => {
  const categories = await Category.findAll();

  res.render("categories/index", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

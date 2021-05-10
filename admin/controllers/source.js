const Source = require("../../models/Source");
const Category = require("../../models/Category");
const SourceCategories = require("../../models/SourceCategories");
const CategoryTranslation = require("../../models/CategoryTranslation");

const { validationResult } = require("express-validator/check");
const ArticleViewed = require("../../models/ArticleViewed");

exports.getViewSource = async (req, res, next) => {
  const sourceName = req.params.sourceName;
  const source = await Source.findOne({ where: { name: sourceName } });
  res.render("source/source-detail", {
    path: "/login",
    pageTitle: "Login",
    source: source,
  });
};

exports.getTest1 = async (req, res, next) => {
  // const sourceName = req.params.sourceName;
  // const source = await Source.findOne({ where: { name: sourceName } });
  res.render("test/walkthrough", {
    path: "/login",
    pageTitle: "Login",
    // source: source,
  });
};

exports.getViewSourceCategory = async (req, res, next) => {
  const sourceName = req.params.sourceName;
  let sourceId;
  const source = await Source.findOne({ where: { name: sourceName } });
  sourceId = source.id;
  //   const categories = await Source.findAll({
  //     where: { id: sourceId },
  //     include: [{ model: Cate }],
  //   });
  const categories = await SourceCategories.findAll({
    where: { sourceId: sourceId, id: 1 },
    include: [
      {
        model: Category,
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      },
    ],
  });
  console.log(categories);
  res.render("source/source-category", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
  });
};

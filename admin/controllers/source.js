const Source = require("../../models/Source");
const Category = require("../../models/Category");
const SourceCategories = require("../../models/SourceCategories");
const CategoryTranslation = require("../../models/CategoryTranslation");

const { validationResult } = require("express-validator/check");
const ArticleViewed = require("../../models/ArticleViewed");

// Hírportál adatlapja
exports.getViewSource = async (req, res, next) => {
  const sourceName = req.params.newsPortal;
  console.log(req.params);
  let sourceId;
  const source = await Source.findOne({ where: { name: sourceName } });
  sourceId = source.id;
  console.log(sourceId);
  const categories = await SourceCategories.findAll({
    where: { sourceId: sourceId },
    include: [
      {
        model: Category,
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      },
    ],
  });
  res.render("source/source-detail", {
    path: "/login",
    pageTitle: "Login",
    source: source,
    categories: categories,
  });
};

exports.getViewChannels = async (req, res, next) => {
  const source = await Source.findAll();
  console.log(source);
  // const categories = await SourceCategories.findAll({
  //   where: { sourceId: sourceId },
  //   include: [
  //     {
  //       model: Category,
  //       include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  //     },
  //   ],
  // });
  res.render("source/AllChannels", {
    path: "/login",
    pageTitle: "Login",
    source: source,
    allChannelNumber: source.length,
    // categories: categories,
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
  const sourceName = req.params.newsPortal;
  const categoryName = req.params.categoryName;
  console.log(req.params);
  let sourceId;
  const source = await Source.findOne({ where: { name: sourceName } });
  console.log(source);
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
        include: [
          {
            model: CategoryTranslation,
            where: { languageId: 2, name: categoryName },
          },
        ],
      },
    ],
  });
  // console.log(categories);
  res.render("source/source-category", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
  });
};

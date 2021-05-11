const Source = require("../../../models/Source");
const Category = require("../../../models/Category");
const SourceCategories = require("../../../models/SourceCategories");
const CategoryTranslation = require("../../../models/CategoryTranslation");
const Articles = require("../../../models/Article");

exports.getChannelDetail = async (req, res, next) => {
  const channelName = req.params.channelName;
  let channelId;
  const channel = await Source.findOne({ where: { seoUrl: channelName } });
  channelId = channel.id;
  const categories = await SourceCategories.findAll({
    Where: { sourceId: channelId },
    include: [
      {
        model: Category,
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      },
    ],
  });
  const articles = await Articles.findAll({
    where: { sourceId: channelId },
    limit: 7,
  });
  res.render("dynamicLinks/channel-detail", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
    channel: channel,
    articles: articles,
  });
};

exports.getChannelNewsByCategory = async (req, res, next) => {
  const channelName = req.params.channelName;
  const categoryName = req.params.categoryName;
  let categoryId;
  let channelId;
  const channel = await Source.findOne({ where: { seoUrl: channelName } });
  channelId = channel.id;
  const category = await Category.findOne({
    where: { seoUrl: categoryName },
  });
  categoryId = category.id;

  const categories = await Articles.findAll({
    include: [
      {
        model: Source,
        where: { id: channelId },
      },
      {
        model: Category,
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      },
    ],
  });

  //   categoryName = categories.id;
  //   for (let i = 0; i < categories.length; i++) {
  //     for (let j = 0; j < categories[i].Articles.length; j++) {
  //       console.log(categories[i].Articles[j].title);
  //     }
  //   }
  console.log(categories);
  res.render("dynamicLinks/channel-articles-by-category", {
    path: "/login",
    pageTitle: "Login",
    articles: categories,
    channelName: channelName,
    categoryName: categoryName,
  });
};

exports.getArticleDetail = async (req, res, next) => {
  const channelName = req.params.channelName;
  const articleTitle = req.params.articleTitle;
  const categoryName = req.params.categoryName;
  let categoryId;
  let channelId;

  const channel = await Source.findOne({ where: { seoUrl: channelName } });
  channelId = channel.id;
  const category = await Category.findOne({
    inlcude: [
      {
        model: CategoryTranslation,
        where: { languageId: 2, name: categoryName },
      },
    ],
  });
  categoryId = category.id;

  const article = await Articles.findOne({
    where: { seoUrl: articleTitle },
    include: [
      {
        model: Source,
        where: { id: channelId },
      },
      {
        model: Category,
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      },
    ],
  });
  res.render("dynamicLinks/article-detail", {
    path: "/login",
    pageTitle: "Login",
    article: article,
    categoryName: article.Category.CategoryTranslations[0].name,
    // articles: categories,
    // channelName: channelName,
    // categoryName: categoryName,
  });
};

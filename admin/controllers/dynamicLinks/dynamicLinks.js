const Source = require("../../../models/Source");
const Category = require("../../../models/Category");
const SourceCategories = require("../../../models/SourceCategories");
const CategoryTranslation = require("../../../models/CategoryTranslation");
const Articles = require("../../../models/Article");
const ArticleComment = require("../../../models/ArticleComment");
const User = require("../../../models/Users");

exports.getSelectedCategoryArticles = async (req, res, next) => {
  const categoryName = req.params.categoryName;
  let categoryId;
  let categoryNameView;
  const category = await Category.findOne({
    where: { seoUrl: categoryName },
    include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  });

  categoryId = category.id;
  categoryNameView = category.CategoryTranslations[0].name;

  const articles = await Articles.findAll({
    where: { categoryId: categoryId },
    limit: 7,
    include: [{ model: Category }, { model: Source }],
  });
  res.render("dynamicLinks/articles-by-category", {
    path: "/login",
    pageTitle: "Login",
    categoryNameView: categoryNameView,
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
    where: { categoryId: categoryId },
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
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }

  const channel = await Source.findOne({ where: { seoUrl: channelName } });
  channelId = channel.id;
  const category = await Category.findOne({
    where: { seoUrl: categoryName },
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
  const comments = await ArticleComment.findAll({
    where: { articleId: article.id },
    include: [{ model: User }],
  });
  console.log(comments);
  res.render("dynamicLinks/article-detail", {
    path: "/login",
    pageTitle: "Login",
    article: article,
    categoryName: article.Category.CategoryTranslations[0].name,
    comments: comments,
    logged: logged,
  });
};

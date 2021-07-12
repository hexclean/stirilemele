const Source = require("../../../models/Source");
const Category = require("../../../models/Category");
const SourceCategories = require("../../../models/SourceCategories");
const CategoryTranslation = require("../../../models/CategoryTranslation");
const Articles = require("../../../models/Article");
const ArticleComment = require("../../../models/ArticleComment");
const User = require("../../../models/Users");
const ITEMS_PER_PAGE = 40;

exports.getSelectedCategoryArticles = async (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  const categoryName = req.params.categoryName;
  let categoryId;
  let categoryNameView;

  const category = await Category.findOne({
    where: { seoUrl: categoryName },
    include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  });

  categoryId = category.id;
  categoryNameView = category.CategoryTranslations[0].name;

  await Articles.findAll({
    where: { categoryId: categoryId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Category,
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      },
      { model: Source },
    ],
  })
    .then(async (numArticles) => {
      totalItems = numArticles;
      return await Articles.findAll({
        where: { categoryId: categoryId },
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        include: [
          {
            model: Category,
            include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
          },
          { model: Source },
        ],
      });
    })
    .then((articles) => {
      res.render("dynamicLinks/articles-by-category", {
        path: "/login",
        pageTitle: "Login",
        categoryNameView: categoryNameView,
        // articles: articles.reverse(),
        articles: articles.reverse(),
        logged: logged,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
        currentPage: page,
      });
    });
};

exports.getArticleDetail = async (req, res, next) => {
  const channelName = req.params.channelName;
  const articleTitle = req.params.articleTitle;
  const categoryName = req.params.categoryName;
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
    order: [["createdAt", "DESC"]],
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

  // const comments = await ArticleComment.findAll({
  //   where: { articleId: article.id },
  //   include: [{ model: User }],
  // });

  res.render("dynamicLinks/article-detail", {
    path: "/login",
    pageTitle: "Login",
    article: article,
    categoryName: article.Category.CategoryTranslations[0].name,
    // comments: comments,
    logged: logged,
    categoryParams: categoryName,
    channelParams: channelName,
    articleParams: articleTitle,
  });
};

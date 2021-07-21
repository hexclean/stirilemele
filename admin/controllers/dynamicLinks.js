const Source = require("../../models/Source");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const Articles = require("../../models/Article");
const ITEMS_PER_PAGE = 40;
const { getLanguageCode } = require("../../shared/language");

exports.getSelectedCategoryArticles = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let cookie = req.cookies.cookie;
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
    include: [
      { model: CategoryTranslation, where: { languageId: languageCode } },
    ],
  });

  categoryId = category.id;
  categoryNameView = category.CategoryTranslations[0].name;

  await Articles.findAll({
    where: { categoryId: categoryId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Category,
        include: [
          { model: CategoryTranslation, where: { languageId: languageCode } },
        ],
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
            include: [
              {
                model: CategoryTranslation,
                where: { languageId: languageCode },
              },
            ],
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
        cookie: cookie,
        imageUrl: "",
        description: "Știrielmele",
        url: "",
      });
    });
};

exports.getArticleDetail = async (req, res, next) => {
  let cookie = req.cookies.cookie;
  const languageCode = getLanguageCode(req.cookies.language);
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
        where: { languageId: languageCode, name: categoryName },
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
        include: [
          { model: CategoryTranslation, where: { languageId: languageCode } },
        ],
      },
    ],
  });
  console.log(article.imageUrl);
  res.render("dynamicLinks/article-detail", {
    path: "/login",
    pageTitle: "Login",
    article: article,
    categoryName: article.Category.CategoryTranslations[0].name,
    imageUrl: article.imageUrl,
    description: article.title,
    url: article.link,
    logged: logged,
    categoryParams: categoryName,
    channelParams: channelName,
    articleParams: articleTitle,
    cookie: cookie,
  });
};

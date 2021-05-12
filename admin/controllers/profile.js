const Source = require("../../models/Source");
const Category = require("../../models/Category");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const SourceCategories = require("../../models/SourceCategories");
const CategoryTranslation = require("../../models/CategoryTranslation");
const Articles = require("../../models/Article");
const UserInterestedSources = require("../../models/UserInterestedSources");
const SendEmailCategory = require("../../models/SendEmailCategory");
const SendEmailSource = require("../../models/SendEmailSource");

exports.getProfile = async (req, res, next) => {
  res.render("profile/index", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.getCategoryEditing = async (req, res, next) => {
  const categories = await Category.findAll({
    include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  });

  const activeSwitch = await UserInterestedCategories.findAll({
    where: { userId: req.user.id },
  });
  const channels = await Source.findAll();

  res.render("profile/categories-edit", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
    channels: channels,
    activeSwitch: activeSwitch,
  });
};

exports.getChannelEditing = async (req, res, next) => {
  const activeSwitch = await UserInterestedSources.findAll({
    where: { userId: req.user.id },
  });

  const channels = await Source.findAll();

  res.render("profile/channel-edit", {
    path: "/login",
    pageTitle: "Login",
    channels: channels,
    activeSwitch: activeSwitch,
  });
};

exports.getSendEmailEndOfTheDay = async (req, res, next) => {
  const categories = await Category.findAll({
    include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  });

  const activeSwitchCategory = await SendEmailCategory.findAll({
    where: { userId: req.user.id },
  });

  const activeSwitchSource = await SendEmailSource.findAll({
    where: { userId: req.user.id },
  });

  const channels = await Source.findAll();

  res.render("profile/send-email-day", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
    channels: channels,
    activeSwitchSource: activeSwitchSource,
    activeSwitchCategory: activeSwitchCategory,
  });
};

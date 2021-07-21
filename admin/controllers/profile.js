const Source = require("../../models/Source");
const User = require("../../models/Users");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const SourceCategories = require("../../models/SourceCategories");
const CategoryTranslation = require("../../models/CategoryTranslation");
const Category = require("../../models/Category");
const UserInterestedSources = require("../../models/UserInterestedSources");
const SendEmailCategory = require("../../models/SendEmailCategory");
const SendEmailSource = require("../../models/SendEmailSource");
const { getLanguageCode } = require("../../shared/language");

exports.getProfile = async (req, res, next) => {
  res.render("profile/index", {
    path: "/login",
    pageTitle: "Login",
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

exports.getPrimaryData = async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  let cookie = req.cookies.cookie;
  res.render("profile/primaryDataChange", {
    path: "/login",
    pageTitle: "Login",
    user: user,
    logged: 1,
    cookie: cookie,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

exports.getNewsletter = async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  res.render("profile/newsletter", {
    path: "/login",
    pageTitle: "Login",
    user: user,
    logged: 1,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

exports.getContact = async (req, res, next) => {
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  res.render("profile/contact", {
    path: "/login",
    pageTitle: "Login",
    logged: logged,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

exports.getCategoryEditing = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let cookie = req.cookies.cookie;
  const categories = await Category.findAll({
    include: [
      { model: CategoryTranslation, where: { languageId: languageCode } },
    ],
  });
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
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
    logged: logged,
    cookie: cookie,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

exports.getChannelEditing = async (req, res, next) => {
  const activeSwitch = await UserInterestedSources.findAll({
    where: { userId: req.user.id },
  });
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  let cookie = req.cookies.cookie;
  const channels = await Source.findAll();

  res.render("profile/channel-edit", {
    path: "/login",
    pageTitle: "Login",
    channels: channels,
    logged: logged,
    activeSwitch: activeSwitch,
    cookie: cookie,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
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
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

exports.getEmailSender = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
    });
    const channels = await Source.findAll();

    const activeSwitch = await SendEmailCategory.findAll({
      where: { userId: req.user.id },
    });

    const activeSwitchChannel = await SendEmailSource.findAll({
      where: { userId: req.user.id },
    });

    res.render("profile/send-email-day", {
      path: "/login",
      pageTitle: "Login",
      categories: categories,
      channels: channels,
      activeSwitch: activeSwitch,
      activeSwitchChannel: activeSwitchChannel,
      imageUrl: "",
      description: "Știrielmele",
      url: "",
    });
  } catch (error) {
    console.log(error);
  }
};

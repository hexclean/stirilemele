const bcrypt = require("bcryptjs");
const Source = require("../../models/Source");
const Categories = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");

const { validationResult } = require("express-validator/check");

exports.getSelectInterestedCategory = async (req, res, next) => {
  const categories = await Categories.findAll({
    include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  });
  res.render("register-steps/categories-config", {
    path: "/login",
    pageTitle: "Login",
    categories: categories,
    // errorMessage: message,
    // oldInput: {
    //   email: "",
    //   password: "",
    // },
    // validationErrors: [],
  });
};

exports.postAddFavouriteCategory = async (req, res, next) => {
  const filteredCategory = req.body.categoryId.filter(Boolean);
  let catId = req.body.allCat;
  console.log(req.body);
  try {
    for (let i = 0; i < filteredCategory.length; i++) {
      await UserInterestedCategories.update(
        {
          active: filteredCategory[i] == "on" ? 1 : 0,
          userId: req.user.id,
        },
        {
          where: {
            userId: req.user.id,
            categoryId: catId[i],
          },
        }
      );
    }
    return res.redirect("/selectati-channel");
  } catch (error) {
    console.log(error);
  }
};

exports.getSelectInterestedChannel = async (req, res, next) => {
  const channels = await Source.findAll();
  res.render("register-steps/channel-select", {
    path: "/login",
    pageTitle: "Login",
    channels: channels,
    // errorMessage: message,
    // oldInput: {
    //   email: "",
    //   password: "",
    // },
    // validationErrors: [],
  });
};
exports.postAddFavouriteChannel = async (req, res, next) => {
  const filteredChannel = req.body.categoryId.filter(Boolean);
  let channelId = req.body.channelId;
  try {
    for (let i = 0; i < filteredChannel.length; i++) {
      await UserInterestedSources.update(
        {
          active: filteredChannel[i] == "on" ? 1 : 0,
          userId: req.user.id,
        },
        {
          where: {
            userId: req.user.id,
            sourceId: channelId[i],
          },
        }
      );
    }
    return res.redirect("/stiri");
  } catch (error) {
    console.log(error);
  }
};

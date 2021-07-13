const express = require("express");
const { check, body } = require("express-validator/check");
const authController = require("../controllers/auth");
const router = express.Router();
const User = require("../../models/Users");
router.get("/login", authController.getLogin);

router.post("/delete-account", authController.postDeleteAccount);

router.get("/inregistrare", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Adresa de email invalidă!")
      .normalizeEmail(),
    body("password", "Email sau parola invalidă!")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Adresa de email invalidă!")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userDoc) => {
          console.log(userDoc);
          if (userDoc) {
            return Promise.reject(
              "Aceasta adresa de email este asociată unui cont existent!"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Vă rugăm să introduceți o parolă cel puțin 6 caractere!"
    ).isLength({ min: 6 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(
            "Parola de confirmare nu este aceeași cu prima parolă introdusă!"
          );
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

// router.get("/reset", authController.getReset);

// router.post("/reset", authController.postReset);

// router.get("/reset/:token", authController.getNewPassword);

// router.post("/new-password", authController.postNewPassword);

module.exports = router;

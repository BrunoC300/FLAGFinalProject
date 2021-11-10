const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password, peso, altura, idade } = req.body;

      // Create user
      const user = new User({ username, email, peso, altura, idade });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome!");
        res.redirect("/workouts");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome!");
    const redirectUrl = req.session.returnTo || "/workouts";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Adeus!");
  res.redirect("/workouts");
});
module.exports = router;

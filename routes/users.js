const express = require("express");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password, peso, altura, idade } = req.body;

      // Create user
      const user = new User({ username, email, peso, altura, idade });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome!");
      res.redirect("/workouts");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);
module.exports = router;

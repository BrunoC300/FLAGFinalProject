const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", async (req, res) => {
  console.log(req.body.username);
  console.log(req.body.email);
  const { username, email, password, peso, altura, idade } = req.body;

  // Create user
  const user = new User({ username, email, peso, altura, idade });
  const registeredUser = await User.register(user, password);
  console.log(registeredUser);
  //req.flash("Welcome!");
  res.redirect("/workouts");
});
module.exports = router;

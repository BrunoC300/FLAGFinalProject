const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);
router.get("/:id/completeProfile", users.renderProfile);
router.post("/user/completeProfile", catchAsync(users.completeProfile));

module.exports = router;

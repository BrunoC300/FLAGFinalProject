const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const workouts = require("../controllers/workouts");
const multer = require("multer");
const { storage } = require("../cloudinary");
const Workout = require("../models/Workout");
const upload = multer({ storage });
const { isLoggedIn } = require("../middleware/validations");

router.route("/").get(catchAsync(workouts.index));

router.route("/new").get(catchAsync(workouts.renderNewForm));

module.exports = router;

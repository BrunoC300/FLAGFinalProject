const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const exercise = require("../controllers/exercises");
const multer = require("multer");
const { storage } = require("../cloudinary");
const Exercise = require("../models/Exercise");
const upload = multer({ storage });
const { isLoggedIn, isExerciseAuthor } = require("../middleware/validations");

router
  .route("/")
  .get(catchAsync(exercise.index))
  .post(isLoggedIn, upload.array("image"), catchAsync(exercise.createExercise));

router.get("/new", isLoggedIn, exercise.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(exercise.showExercise))
  .put(
    isLoggedIn,
    isExerciseAuthor,
    upload.array("image"),
    catchAsync(exercise.updateExercise)
  )
  .delete(isLoggedIn, isExerciseAuthor, catchAsync(exercise.deleteExercise));

router.get(
  "/:id/edit",
  isLoggedIn,
  isExerciseAuthor,
  catchAsync(exercise.renderEditForm)
);

router.get("/add/:id", isLoggedIn, catchAsync(exercise.addToFavorites));

router.get("/remove/:id", isLoggedIn, catchAsync(exercise.removeFromFavorites));

module.exports = router;

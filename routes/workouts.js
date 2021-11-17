const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const workouts = require("../controllers/workouts");
const multer = require("multer");
const { storage } = require("../cloudinary");
const Workout = require("../models/Workout");
const upload = multer({ storage });
const { isLoggedIn, isWorkoutAuthor } = require("../middleware/validations");

router
  .route("/")
  .get(catchAsync(workouts.index))
  .post(isLoggedIn, upload.array("image"), catchAsync(workouts.createWorkout));

router.route("/new").get(isLoggedIn, catchAsync(workouts.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(workouts.show))
  .put(
    isLoggedIn,
    isWorkoutAuthor,
    upload.array("image"),
    catchAsync(workouts.updateworkout)
  )
  .delete(isLoggedIn, isWorkoutAuthor, catchAsync(workouts.deleteExercise));

router.get(
  "/:id/edit",
  isLoggedIn,
  isWorkoutAuthor,
  catchAsync(workouts.renderEditForm)
);

router.post(
  "/:id/addExercise",
  isLoggedIn,
  isWorkoutAuthor,
  catchAsync(workouts.addExercises)
);
router.delete(
  "/:id/removeExercise/:exerciseID",
  isLoggedIn,
  isWorkoutAuthor,
  catchAsync(workouts.deleteExercise)
);

router.get("/add/:id", isLoggedIn, catchAsync(workouts.addToFavorites));

router.get("/remove/:id", isLoggedIn, catchAsync(workouts.removeFromFavorites));

module.exports = router;

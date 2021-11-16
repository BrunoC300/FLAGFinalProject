const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const workouts = require("../controllers/workouts");
const multer = require("multer");
const { storage } = require("../cloudinary");
const Workout = require("../models/Workout");
const upload = multer({ storage });
const { isLoggedIn } = require("../middleware/validations");

router
  .route("/")
  .get(catchAsync(workouts.index))
  .post(isLoggedIn, upload.array("image"), catchAsync(workouts.createWorkout));

router.route("/new").get(isLoggedIn, catchAsync(workouts.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(workouts.show))
  .put(isLoggedIn, upload.array("image"), catchAsync(workouts.updateworkout))
  .delete(isLoggedIn, catchAsync(workouts.deleteExercise));

router.get("/:id/edit", isLoggedIn, catchAsync(workouts.renderEditForm));

router.post("/:id/addExercise", isLoggedIn, catchAsync(workouts.addExercises));
router.delete(
  "/:id/removeExercise",
  isLoggedIn,
  catchAsync(workouts.deleteExercise)
);

module.exports = router;

const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const Exercise = require("../models/Exercise");
const upload = multer({ storage });

router.get(
  "/exercises",
  catchAsync(async (req, res) => {
    const exercises = await Exercise.find({});
    res.render("exercises/show", { exercises: exercises });
  })
);
router.get("/exercises/new", (req, res) => {
  res.render("exercises/new");
});

router.post(
  "/exercises",
  upload.array("image"),
  catchAsync(async (req, res, next) => {
    const { name, descricao } = req.body;
    console.log(req.files);
    //Create exercise
    const exercise = new Exercise({ name, descricao });
    exercise.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    exercise.save();
    req.flash("success", "Exercicio Criado!");
    res.redirect("exercises/show");
  })
);

router.get(
  "/exercises/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      req.flash("error", "Esse exercicio não existe!");
      return res.redirect("/exercises");
    }
    res.render("exercises/edit", { exercise });
  })
);

router.put(
  "/exercises/:id",
  upload.array("image"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndUpdate(id, {
      ...req.body.exercise,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    exercise.images.push(...imgs);
    await exercise.save();
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/exercises/${exercise._id}`);
  })
);

router.delete(
  "/exercises/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Exercise.findByIdAndDelete(id);
    res.flash("Success", "Exercicio Apagado!");
    res.redirect("/exercises");
  })
);

// router.post("/exercises/new", upload.array("image"), (req, res) => {
//   console.log(storage);
//   try {
//     console.log(req.body);
//     console.log(req.files);
//     res.send("It Worket!");
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;

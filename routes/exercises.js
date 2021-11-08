const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const Exercise = require("../models/Exercise");
const upload = multer({ storage });

router.get("/exercises", (req, res) => {
  Exercise.find({}, function (err, exercises) {
    if (err) {
      console.log(err);
    } else {
      res.render("exercises/show", { exercises: exercises });
    }
  });
});
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

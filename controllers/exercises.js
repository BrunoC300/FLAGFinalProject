const { cloudinary } = require("../cloudinary");
const Exercise = require("../models/Exercise");
const User = require("../models/User");

// @desc      Get all exercises
// @route     GET /exercises
// @access    Public

module.exports.index = async (req, res) => {
  if (req.query.grupoMuscular) {
    Exercise.find(
      { grupoMuscular: req.query.grupoMuscular },
      function (err, exercises) {
        if (err) {
          console.log(err);
        } else {
          res.render("exercises/index", { exercises: exercises });
        }
      }
    );
  } else {
    const exercises = await Exercise.find({});
    res.render("exercises/index", { exercises: exercises });
  }
};

// @desc      Show form to add a new Exercise
// @route     GET /exercises/new
// @access    Public

module.exports.renderNewForm = (req, res) => {
  res.render("exercises/new");
};

// @desc      Create a new Exercise
// @route     POST /exercises
// @access    Private

module.exports.createExercise = async (req, res) => {
  const { name, descricao, grupoMuscular } = req.body;

  //Create exercise
  const exercise = await new Exercise({ name, descricao, grupoMuscular });
  exercise.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  exercise.save();
  req.flash("success", "Exercicio Criado!");
  res.redirect("exercises/show");
};

// @desc      Show details of the specific exercise
// @route     Get /exercises/:id
// @access    Public

module.exports.showExercise = async (req, res) => {
  const { id } = req.params;
  const exercise = await Exercise.findById(id);
  console.log(exercise);
  if (!exercise) {
    req.flash("error", "Esse exercicio não existe!");
    return res.redirect("/exercises");
  }
  res.render("exercises/show", { exercise });
};

// @desc      Render Edit Form
// @route     Get /exercises/:id/edit
// @access    Private

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const exercise = await Exercise.findById(id);
  if (!exercise) {
    req.flash("error", "Esse exercicio não existe!");
    return res.redirect("/exercises");
  }
  res.render("exercises/edit", { exercise });
};

// @desc      Update exercise details
// @route     PUT /exercises/:id
// @access    Private

module.exports.updateExercise = async (req, res) => {
  const { id } = req.params;
  const exercise = await Exercise.findByIdAndUpdate(id, {
    ...req.body,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  exercise.images.push(...imgs);
  await exercise.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //Tirar da BD todas as imagens onde o filename = ao filename do array "deleteImages"
    await exercise.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Exercicio atualizado!");
  res.redirect(`/exercises/${exercise._id}`);
};

// @desc      Delete Exercise
// @route     DELETE /exercises/:id
// @access    Private

module.exports.deleteExercise = async (req, res) => {
  const { id } = req.params;
  await Exercise.findByIdAndDelete(id);
  res.flash("Success", "Exercicio Apagado!");
  res.redirect("/exercises");
};

module.exports.addToFavorites = async (req, res) => {
  const { id } = req.params;
  const exercise = await Exercise.findById(id);
  const user = await User.findById(req.user._id);
  user.exercicios_favoritos.push(exercise);
  user.save();
  req.flash("success", "Exercicio adicionado aos favoritos");
  setTimeout(function () {
    res.redirect("/exercises");
  }, 1000);
};

module.exports.removeFromFavorites = async (req, res) => {
  const { id } = req.params;
  const userID = req.user._id;
  await User.findByIdAndUpdate(userID, { $pull: { exercicios_favoritos: id } });
  req.flash("success", "Exercicio Removido dos favoritos");
  setTimeout(function () {
    res.redirect("/exercises");
  }, 1000);
};

const { cloudinary } = require("../cloudinary");
const Exercise = require("../models/Exercise");
const User = require("../models/User");
const Workout = require("../models/Workout");
const Details = require("../models/ExerciseDetails");

// @desc      Get all workouts
// @route     GET /workouts
// @access    Public

module.exports.index = async (req, res) => {
  if (req.query.grupoMuscular) {
    Workout.find(
      { grupoMuscular: req.query.grupoMuscular },
      function (err, workouts) {
        if (err) {
          console.log(err);
        } else {
          res.render("workouts/index", { workouts: workouts });
        }
      }
    );
  } else {
    const workouts = await Workout.find({});
    res.render("workouts/index", { workouts: workouts });
  }
};

// @desc      Show details of the specific workout
// @route     Get /workouts/:id
// @access    Public

module.exports.show = async (req, res) => {
  const { id } = req.params;
  await Workout.findById(id)
    .populate({
      path: "lista_exercicios",
      populate: {
        path: "exercicio",
      },
    })
    .populate("createdBy")
    .exec(function (err, workout) {
      if (err) {
        req.flash("error", "Esse exercicio não existe!");
        return res.redirect("/workouts");
      } else {
        res.render("workouts/show", { workout: workout });
      }
    });
};

// @desc      Show form to add a new workout
// @route     GET /workouts/new
// @access    Public

module.exports.renderNewForm = async (req, res) => {
  res.render("workouts/new");
};

// @desc      Create a new workout
// @route     POST /workouts
// @access    Private

module.exports.createWorkout = async (req, res) => {
  const { nome, tipo, duracao, grupoMuscular, nivel } = req.body;
  const criador = req.user._id;

  //Create workout
  const workout = await new Workout({
    nome,
    tipo,
    duracao,
    grupoMuscular,
    nivel,
  });
  workout.createdBy = criador;
  workout.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  workout.save();
  req.flash("success", "Escolha os exercicios!");
  res.render("workouts/show", { workout: workout });
};

// @desc      Render Edit Form
// @route     Get /workouts/:id/edit
// @access    Private

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const exercises = await Exercise.find();
  await Workout.findById(id)
    .populate({
      path: "lista_exercicios",
      populate: {
        path: "exercicio",
      },
    })
    .populate("createdBy")
    .exec(function (err, workout) {
      if (err) {
        req.flash("error", "Esse exercicio não existe!");
        return res.redirect("/workouts");
      } else {
        res.render("workouts/edit", { workout: workout, exercises });
      }
    });
};

// @desc      Update workout details
// @route     PUT /workouts/:id
// @access    Private

module.exports.updateworkout = async (req, res) => {
  const { id } = req.params;
  const workout = await Workout.findByIdAndUpdate(id, {
    ...req.body,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  workout.images.push(...imgs);
  await workout.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //Tirar da BD todas as imagens onde o filename = ao filename do array "deleteImages"
    await workout.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Workout atualizado!");
  res.redirect(`/workouts/${workout._id}`);
};

// @desc      Delete workout
// @route     DELETE /workouts/:id
// @access    Private

module.exports.deleteworkout = async (req, res) => {
  const { id } = req.params;
  await workout.findByIdAndDelete(id);
  res.flash("Success", "Workout Apagado!");
  res.redirect("/workouts");
};

// @desc      Adicionar exercicios ao workout
// @route     POST /workouts/:id/addExercise
// @access    Private

module.exports.addExercises = async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  const details = new Details(req.body.details);
  workout.lista_exercicios.push(details);
  await details.save();
  await workout.save();
  req.flash("success", "Adicionou novo Exercicio ao Workout!");
  res.redirect(`/workouts/${workout._id}/edit`);
};

// @desc      Delete exercicio do workout
// @route     DELETE /workouts/:id/removeExercise/:exerciseID
// @access    Private

module.exports.deleteExercise = async (req, res) => {
  console.log(req.params);
  const { id, exerciseID } = req.params;
  console.log(id, exerciseID);
  await Workout.findByIdAndUpdate(id, {
    $pull: { lista_exercicios: exerciseID },
  });
  await Details.findByIdAndDelete(exerciseID);
  req.flash("success", "Removeu um Exercicio do Treino");
  res.redirect(`/workouts/${id}`);
};

// @desc      Add Exercise to Favorites
// @route     GET /workouts/add/:id
// @access    Private

module.exports.addToFavorites = async (req, res) => {
  const { id } = req.params;
  const workout = await Workout.findById(id);
  const user = await User.findById(req.user._id);
  user.treinos_guardados.push(workout);
  user.save();
  req.flash("success", "Treino adicionado aos favoritos");
  setTimeout(function () {
    res.redirect("/workouts");
  }, 1000);
};

// @desc      Add Exercise to Favorites
// @route     GET /workouts/remove/:id
// @access    Private

module.exports.removeFromFavorites = async (req, res) => {
  const { id } = req.params;
  const userID = req.user._id;
  await User.findByIdAndUpdate(userID, { $pull: { treinos_guardados: id } });
  req.flash("success", "Treino Removido dos favoritos");
  setTimeout(function () {
    res.redirect("/workouts");
  }, 1000);
};

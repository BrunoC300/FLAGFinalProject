const { cloudinary } = require("../cloudinary");
const Exercise = require("../models/Exercise");
const User = require("../models/User");
const Workout = require("../models/Workout");
const Details = require("../models/ExerciseDetails");

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

// @desc      Get all workouts
// @route     GET /workouts
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

// @desc      Show details of the specific workout
// @route     Get /workouts/:id
// @access    Public

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

module.exports.addExercises = async (req, res) => {
  const workout = await Workout.findById(req.params.id);
  const details = new Details(req.body.details);
  workout.lista_exercicios.push(details);
  await details.save();
  await workout.save();
  req.flash("success", "Adicionou novo Exercicio ao Workout!");
  res.redirect(`/workouts/${workout._id}/edit`);
};

module.exports.deleteExercise = async (req, res) => {
  const { id, detailsId } = req.params;
  await Workout.findByIdAndUpdate(id, {
    $pull: { lista_exercicios: detailsId },
  });
  await Details.findByIdAndDelete(detailsId);
  req.flash("success", "Removeu um Exercicio");
  res.redirect(`/workouts/${id}`);
};

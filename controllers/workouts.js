const { cloudinary } = require("../cloudinary");
const User = require("../models/User");
const Workout = require("../models/Workout");

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
    .populate("lista_exercicios.exercicio")
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
  console.log("enterei");
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
module.exports.createWorkout2 = async (req, res) => {
  const { name, descricao } = req.body;

  //Create workout
  const workout = await new Workout({ name, descricao });
  workout.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  workout.save();
  req.flash("success", "Exercicio Criado!");
  res.redirect("workouts/show");
};

// @desc      Show details of the specific workout
// @route     Get /workouts/:id
// @access    Public

// @desc      Render Edit Form
// @route     Get /workouts/:id/edit
// @access    Private

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const workout = await workout.findById(id);
  if (!workout) {
    req.flash("error", "Esse exercicio não existe!");
    return res.redirect("/workouts");
  }
  res.render("workouts/edit", { workout });
};

// @desc      Update workout details
// @route     PUT /workouts/:id
// @access    Private

module.exports.updateworkout = async (req, res) => {
  const { id } = req.params;
  const workout = await workout.findByIdAndUpdate(id, {
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
  req.flash("success", "Exercicio atualizado!");
  res.redirect(`/workouts/${workout._id}`);
};

// @desc      Delete workout
// @route     DELETE /workouts/:id
// @access    Private

module.exports.deleteworkout = async (req, res) => {
  const { id } = req.params;
  await workout.findByIdAndDelete(id);
  res.flash("Success", "Exercicio Apagado!");
  res.redirect("/workouts");
};

module.exports.addToFavorites = async (req, res) => {
  const { id } = req.params;
  const workout = await workout.findById(id);
  const user = await User.findById(req.user._id);
  user.exercicios_favoritos.push(workout);
  user.save();
  req.flash("success", "Exercicio adicionado aos favoritos");
  setTimeout(function () {
    res.redirect("/workouts");
  }, 1000);
};

module.exports.removeFromFavorites = async (req, res) => {
  const { id } = req.params;
  const userID = req.user._id;
  await User.findByIdAndUpdate(userID, { $pull: { exercicios_favoritos: id } });
  req.flash("success", "Exercicio Removido dos favoritos");
  setTimeout(function () {
    res.redirect("/workouts");
  }, 1000);
};

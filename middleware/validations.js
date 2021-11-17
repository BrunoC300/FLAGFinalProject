const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Deve ter login feito para efetuar essa ação");
    return res.redirect("/login");
  }
  next();
};
module.exports.isWorkoutAuthor = async (req, res, next) => {
  const { id } = req.params;
  const workout = await Workout.findById(id);
  if (!workout.createdBy.equals(req.user._id)) {
    req.flash("error", "Não tem Permissões para realizar essa ação!");
    return res.redirect(`/workouts/${id}`);
  }
  next();
};
module.exports.isExerciseAuthor = async (req, res, next) => {
  const { id } = req.params;
  const exercise = await Exercise.findById(id);
  if (!exercise.autor.equals(req.user._id)) {
    req.flash("error", "Não tem Permissões para realizar essa ação!");
    return res.redirect(`/exercises/${id}`);
  }
  next();
};

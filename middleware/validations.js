module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Deve ter login feito para efetuar essa ação");
    return res.redirect("/login");
  }
  next();
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Não tem Permissões para realizar essa ação!");
    return res.redirect(`/workouts/${id}`);
  }
  next();
};

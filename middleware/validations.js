module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Deve ter login feito para efetuar essa ação");
    return res.redirect("/login");
  }
  next();
};

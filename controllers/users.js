const User = require("../models/User");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Create user
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Bem vindo!");
      res.redirect(`/${user._id}/completeProfile`);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.completeProfile = async (req, res, next) => {
  const { peso, idade, altura, tipo, nivel } = req.body;
  const id = req.user._id;
  console.log(id);
  const user = await User.findByIdAndUpdate(id, {
    peso: peso,
    idade: idade,
    altura: altura,
    tipo: tipo,
    nivel: nivel,
  });
  await user.save();
  req.flash("Success", "Perfil Completo");
  res.redirect("/exercises");
  console.log(user);
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};
module.exports.renderProfile = (req, res) => {
  res.render("users/completeProfile");
};

module.exports.login = (req, res) => {
  req.flash("success", "Bem vindo de volta!");
  const redirectUrl = req.session.returnTo || "/workouts";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  // req.session.destroy();
  req.flash("success", "Adeus!");
  res.redirect("/workouts");
};

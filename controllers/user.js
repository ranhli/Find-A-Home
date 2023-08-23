const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("auth/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, () => {
      req.flash("success", `Welcome, ${user.username}!`);
      res.redirect("/homes");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogInForm = (req, res) => {
  res.render("auth/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome back, ${req.body.username}!`);
  res.redirect("/homes");
};

module.exports.logout = (req, res) => {
  req.logout(function (e) {
    if (e) {
      return next(e);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/homes");
  });
};

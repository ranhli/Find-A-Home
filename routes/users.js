const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../controllers/user");
const catchAsync = require("../utils/catchAsync");

router
  .route("/register")
  .get(user.renderRegisterForm)
  .post(catchAsync(user.register));

router
  .route("/login")
  .get(user.renderLogInForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login
  );

router.get("/logout", user.logout);

module.exports = router;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const dbUrl = "mongodb://localhost:27017/bnbApp" || process.env.DB_URL;
const secret = process.env.SECRET;
const MongoDBStore = require("connect-mongo");

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MONGODB CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION ERROR");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secret,
  },
});

const sessionConfig = {
  store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // Global Variables
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const bnbs = require("./routes/bnbs");
app.use("/homes", bnbs);
const reviews = require("./routes/reviews");
app.use("/homes/:id/reviews", reviews);
const users = require("./routes/users");
app.use("/", users);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "ERROR";
  }
  res.status(statusCode);
  res.render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});

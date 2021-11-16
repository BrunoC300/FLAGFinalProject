if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const colors = require("colors");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");

const Exercise = require("./models/Exercise");
const User = require("./models/User");
const Workout = require("./models/Workout");

const isLoggedIn = require("./middleware/validations");

// Route files
const userRoutes = require("./routes/users");
const exerciseRoutes = require("./routes/exercises");
const workoutRoutes = require("./routes/workouts");

// Load env vars
// dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //For extra security
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(morgan("tiny"));

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Mount routers

const PORT = process.env.PORT || 3000;

app.use("/exercises", exerciseRoutes);
app.use("/", userRoutes);
app.use("/workouts", workoutRoutes);

app.get("/", isLoggedIn.isLoggedIn, (req, res) => {
  res.render("index");
  req.flash("success", "Bem vindo!");
});

// Exercise.find(function (err, exercises) {
//   if (err) {
//     console.log(err);
//   } else {
//     app.locals.exercicios = exercises;
//   }
// });
app.get("/users", (req, res) => {
  User.find()
    .populate("exercicios_favoritos")
    .exec(function (err, users) {
      if (err) {
        console.log(err);
      } else {
        res.render("users", { users: users });
      }
    });
});
app.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .populate("exercicios_favoritos")
    .exec(function (err, userFound) {
      if (err) {
        console.log(err);
      } else {
        res.render("userOne", { user: userFound });
      }
    });
});
app.get("/user/completeProfile", async (req, res) => {
  res.render("users/completeProfile");
});

//Caso não encontre nenhuma das rotas por nós definidas mostra o erro "Page Not Found"
app.all("*", (req, res, next) => {
  // res.status(404).render("404");
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

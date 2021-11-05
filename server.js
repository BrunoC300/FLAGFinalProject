const express = require("express");
const dotenv = require("dotenv");
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
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");

const Exercises = require("./models/Exercise");
const User = require("./models/User");
const Workout = require("./models/Workout");

// Route files
const userRoutes = require("./routes/users");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// //app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

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

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Mount routers

const PORT = process.env.PORT || 3000;

app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("index");
  req.flash("success", "Bem vindo!");
});
app.get("/exercises", (req, res) => {
  Exercises.find({}, function (err, exercises) {
    if (err) {
      console.log(err);
    } else {
      res.render("exercises", { exercises: exercises });
    }
  });
});
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
app.get("/workouts", (req, res) => {
  Workout.find()
    .populate("lista_exercicios.exercicio")
    .populate("createdBy")
    .exec(function (err, workouts) {
      if (err) {
        console.log(err);
      } else {
        res.render("workouts", { workouts: workouts });
      }
    });
});
// app.post("/register", async(req, res) => {
//   const { name, email, password } = req.body;

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password,
//   });
//   sendTokenResponse(user, 200, res);
// });

//Caso não encontre nenhuma das rotas por nós definidas mostra o erro "Page Not Found"
app.all("*", (req, res, next) => {
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

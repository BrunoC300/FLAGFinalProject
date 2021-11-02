const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const ejs = require("ejs");
const colors = require("colors");

const Exercises = require("./models/Exercise");
const User = require("./models/User");

// Route files

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.set("view engine", "ejs");
// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Mount routers

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("index");
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
  User.findOne({ name: "Beatriz Leal" })
    .populate("exercicios_favoritos")
    .exec(function (err, users) {
      if (err) {
        console.log(err);
      } else {
        res.render("users", { users: users });
      }
    });
});

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

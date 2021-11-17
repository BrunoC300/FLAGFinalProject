const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const ExerciseSchema = new mongoose.Schema({
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
  },
  descricao: {
    type: String,
    required: [true, "Please add an exercise description"],
  },
  grupoMuscular: {
    type: String,
    required: [true, "Please add an exercise description"],
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
});
module.exports = mongoose.model("Exercise", ExerciseSchema);

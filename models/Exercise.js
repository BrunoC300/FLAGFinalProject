const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
  },
  descricao: {
    type: String,
    required: [true, "Please add an exercise description"],
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});
module.exports = mongoose.model("Exercise", ExerciseSchema);

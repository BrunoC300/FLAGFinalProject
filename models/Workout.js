const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const WorkoutSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tipo: {
    type: String,
    required: [true, "Please insert a type"],
  },
  duracao: {
    type: Number,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  grupoMuscular: {
    type: Number,
    required: [true, "Please insert the muscle group"],
  },
  preco: {
    type: Number,
    required: [true, "Please add an age"],
  },
  lista_exercicios: [
    {
      exercicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
      totalSets: {
        type: Number,
        required: [true, "Please enter the number of sets"],
      },
      reps: {
        type: Number,
        required: [true, "Please enter the number of reps"],
      },
      rest: {
        type: Number,
        required: [true, "Please enter the rest time"],
      },
    },
  ],
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Workout", WorkoutSchema);

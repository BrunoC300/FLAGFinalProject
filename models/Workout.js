const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const WorkoutSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nome: {
    type: String,
    required: [true, "Please insert the name of the Workout"],
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
    type: String,
    required: [true, "Please insert the muscle group"],
  },
  nivel: {
    type: String,
    required: [true, "Please insert your level of experience"],
  },
  preco: {
    type: Number,
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

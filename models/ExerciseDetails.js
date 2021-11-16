const mongoose = require("mongoose");

const ExerciseDetailsSchema = new mongoose.Schema({
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
});
module.exports = mongoose.model("ExerciseDetails", ExerciseDetailsSchema);

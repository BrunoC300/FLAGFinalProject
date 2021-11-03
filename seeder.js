// Para utilizar o seeder fazermos na linha de comandos : "node seeder -d" para apagar todos os registos ou "node seeder -i" para preencher com todos os registos

const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const User = require("./models/User");
const Exercise = require("./models/Exercise");
const Workout = require("./models/Workout");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Users.json`, "utf-8")
);
const exercises = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Exercises.json`, "utf-8")
);
const workouts = JSON.parse(
  fs.readFileSync(`${__dirname}/data/Workouts.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    //await User.create(users);
    //await Exercise.create(exercises);
    await Workout.create(workouts);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    //await User.deleteMany();
    //await Exercise.deleteMany();
    await Workout.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

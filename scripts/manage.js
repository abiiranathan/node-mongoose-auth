const yargs = require("yargs");
const User = require("../models/User");
const { setPassword } = require("../auth");
const mongoose = require("mongoose");

const argv = yargs
  .command("createsuperuser", "Create a superuser account")
  .option("mongo_uri", {
    description: "MongoDB connection uri",
    alias: "c",
    type: "string",
    demandOption: "Provide the connection string to mongodb",
  })
  .option("email", {
    description: "A valid email address",
    alias: "e",
    type: "string",
    demandOption: "email address is required",
  })
  .option("firstname", {
    type: "string",
    description: "First name",
    alias: "f",
    demandOption: "firstname is required",
  })
  .option("lastname", {
    type: "string",
    description: "Last name",
    alias: "l",
    demandOption: "lastname is required",
  })
  .option("sex", {
    description: "Your gender",
    alias: "s",
    type: "string",
    choices: ["Male", "Female"],
    demandOption: "Sex is not a valid option",
  })
  .option("password", {
    description: "Pasword for authentication",
    alias: "p",
    type: "string",
    demandOption: "password is required",
  })
  .help()
  .alias("help", "h").argv;

(async function createUser() {
  // Create user in a transaction
  try {
    await mongoose.connect(argv.mongo_uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      const user = await new User({
        firstName: argv.firstname,
        lastName: argv.lastname,
        sex: argv.sex,
        email: argv.email,
        isAdmin: true,
        isStaff: true,
        isActive: true,
      }).save();

      // Set the password to enable hashing
      setPassword(user, argv.password);
      await user.save();
      console.log("Superuser saved successfully");
      process.exit(0);
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

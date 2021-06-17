if (!process.env.SECRET_KEY) {
  console.error("SECRET_KEY not found in env variables!");
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

const authRouter = require("./routes/users");
const User = require("./models/User");
const auth = require("./auth");

module.exports = { authRouter, User, auth };

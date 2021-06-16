// Check for configuration env variables
if (!process.env.SECRET_KEY) {
  console.error(
    `node-mongoose-auth package expects a 'SECRET_KEY' environment variable. 
    This is not set! Your application will NOT run correctly without it.

    Note: In production, your application will not start until the secret key is set!
    `
  );

  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

const authRouter = require("./routes/users");
const User = require("./models/User");
const auth = require("./auth");

module.exports = { authRouter, User, auth };

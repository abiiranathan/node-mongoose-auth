/**
 * Helper functions for setting encrypting the user
 * password using the provided SECRET_KEY and validating
 * the user password using crypto node module and jsonwebtoken.
 */

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

/**
 *
 * @param {User} user
 * @param {string} password
 * @returns User
 */
async function setPassword(user, password) {
  user.salt = crypto.randomBytes(16).toString("hex");
  user.hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, "sha512").toString("hex");
  return user;
}

/**
 *
 * @param {User} user
 * @param {string} password
 * @returns boolean
 */
async function validatePassword(user, password) {
  const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, "sha512").toString("hex");
  return user.hash === hash;
}

/**
 *
 * @param {string} token
 * @returns object(payload) or throws an exception
 */
async function validateToken(token) {
  return jwt.verify(token, process.env.SECRET_KEY);
}

/**
 * Generate user token that expires in 24 hours by default.
 * To change the expiry, set NODE_MONGOOSE_TOKEN_EXP environment
 * variable specifying the number of days.
 *
 * @param {User} user
 * @returns {string} token
 */
async function generateToken(user) {
  let expireDays = 1;
  const errMsg = `Invalid config value for TOKEN_EXPIRES_AFTER. Should be a number, using ${expireDays} day as the default`;

  if (process.env.TOKEN_EXPIRES_AFTER) {
    try {
      const exp = parseFloat(process.env.TOKEN_EXPIRES_AFTER, 10);
      if (typeof exp === "number") {
        expireDays = exp;
      } else {
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  const today = new Date();
  const exp = new Date(today);

  exp.setDate(today.getDate() + expireDays);

  const payload = {
    id: user.id,
    exp: parseInt(exp.getTime() / 1000),
  };

  return jwt.sign(payload, process.env.SECRET_KEY);
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns response
 */
const authMiddleware = async (req, res, next) => {
  const tokenString = req.headers.authorization;

  if (!tokenString) return res.status(403).json({ message: "No authorization credentials sent" });

  const tokenArray = tokenString.split(" ");

  if (tokenArray.length !== 2) return res.status(403).json({ message: "Invalid token!" });

  if (tokenArray[0] !== "Bearer") return res.status(403).json({ message: "Invalid token format!" });

  //We can now work with the token
  const token = tokenArray[1];

  // Validating token retuns user payload or throws an exception
  // if token is invalid or expired
  try {
    const payload = await validateToken(token);

    // Now get the user from the id in the payload
    const user = await User.findById(payload.id);

    if (user == null) {
      return res.status(403).json({ message: "User not found!" });
    } else {
      // Proceed with the happy path
      // Attach the user to the request
      req.user = user;

      // Proceed with other middleware
      next();
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token!" });
  }
};

module.exports = {
  setPassword,
  validatePassword,
  generateToken,
  validateToken,
  authMiddleware,
};

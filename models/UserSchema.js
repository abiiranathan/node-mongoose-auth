const mongoose = require("mongoose");

/**
 *
 * @param {string} email
 * @returns boolean
 */
const validateEmail = function (email) {
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return pattern.test(email);
};

/**
 * Mongoose User schema.
 *
 * Available fields:
 *  - firstName(string required)
 *  - lastName(string required)
 *  - email(string required)
 *  - mobile(string optional)
 *  - address(string optional)
 *  - birthDate(Date optional)
 *  - sex(string enum, ["Male", "Female"])
 *  - about(string optional)
 *  - hash(string optional)
 *  - salt(string optional)
 *  - isActive(boolean defaults to true)
 *  - isStaff(boolean default to false)
 *  - isAdmin(boolean default to false)
 *
 * @returns mongoose.Schema
 */

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 25,
    },
    lastName: {
      type: String,
      required: true,
      max: 25,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      validate: [validateEmail, "Please provide a valid email address"],
    },
    sex: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    mobile: {
      type: String,
      required: false,
      min: 10,
      max: 15,
    },
    address: {
      type: String,
      required: false,
      max: 100,
    },
    birthDate: {
      type: Date,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    hash: {
      type: String,
      required: false,
    },
    salt: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * Override toJSON method so that we return
 * id instead of _id and also remove the secret fields
 * hash and salt when this model is jsonified.
 */
UserSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.__v;
    delete converted.hash;
    delete converted.salt;
  },
});

module.exports = UserSchema;

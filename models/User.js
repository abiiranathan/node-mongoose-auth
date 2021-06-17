const mongoose = require("mongoose");
const UserSchema = require("./UserSchema");

/**
 * You can not add any middleware, statics, or methods after
 * mongoose.model. If you must customize the UserSchema,
 * import the Schema seperately and customize it before
 * importing the User Model or importing the authMiddleware.
 * */

module.exports = mongoose.model("User", UserSchema);

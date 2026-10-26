const { mongoose, Schema, mongo } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: [true, "username already taken"],
  },
  email: {
    type: String,
    require: true,
    unique: [true, "Account already exists with this email address"],
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

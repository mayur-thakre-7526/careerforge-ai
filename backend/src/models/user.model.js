const { mongoose, Schema, mongo } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "username already taken"],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Account already exists with this email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;

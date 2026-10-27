const { mongoose, Schema, model } = require("mongoose");

const blacklistTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: [true, "token is required to be added in blacklist"],
    },
  },
  { timestamps: true },
);

const tokenBlacklist = mongoose.model("TokenBlacklist", blacklistTokenSchema);

module.exports = tokenBlacklist;

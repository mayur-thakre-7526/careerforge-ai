const jwt = require("jsonwebtoken");
const tokenBlacklist = require("../models/blacklist.model.js");

const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  // check if current requested user token is in the blocklisted token or not
  const isTokenBlocklisted = await tokenBlacklist.findOne({ token });

  if (isTokenBlocklisted) {
    return res.status(401).json({
      message: "token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};

module.exports = {authUser};

const jwt = require("jsonwebtoken");
const tokenBlacklist = require("../models/blacklist.model.js");

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // check if current requested user token is in the blocklisted token or not
    const isTokenBlocklisted = await tokenBlacklist.findOne({ token });

    if (isTokenBlocklisted) {
      return res.status(401).json({
        message: "Session has expired. Please log in again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    return next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired session.",
      });
    }

    return res.status(500).json({
      message: "Unable to verify authentication.",
    });
  }
};

module.exports = authUser;

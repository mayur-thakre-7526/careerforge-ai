const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tokenBlacklist = require("../models/blacklist.model.js");

/**
 * @name registerUserController
 * @description registre a new user, expects username, email and password in the request body
 * @access public
 */

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  try {
    if (!normalizedUsername || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ normalizedUsername }, { normalizedEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists withthis email address or username",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while registering the user" });
  }
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */

const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  const user = await User.findOne({ normalizedEmail });

  if (!user) {
    return res.status(400).json({ message: "Invalid user or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    message: "User loggedIn successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (token) {
      await tokenBlacklist.create({ token });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "An error occurred while logging out",
    });
  }
};

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */

const getMeController = async (req, res) => {
  const user = await User.findById(req.user.id).select("_id username email");

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  return res.status(200).json({
    message: "User details fetched successfully.",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};

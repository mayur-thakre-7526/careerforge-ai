// Kisi dusare file me router define karna hai to express use hota hai
const { Router } = require("express");
const authController = require("../controllers/auth.controller.js");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access public
 */

authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access public
 */

authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc clear token from user cookie and add the token in blacklist
 * @access public
 */

authRouter.get("/logout", authController.logoutUserController);

module.exports = authRouter;

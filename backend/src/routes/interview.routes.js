const express = require("express");
const {authUser} = require("../middlewares/auth.middleware.js");
const interviewController = require("../controllers/interview.controller.js");
const upload = require("../middlewares/file.middleware.js");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */

console.log("authUser:", typeof authUser);

console.log("upload.single:", typeof upload.single);

console.log(
  "controller:",
  typeof interviewController.generateInterViewReportController,
);

interviewRouter.post(
  "/",
  authUser,
  upload.single("resume"),
  interviewController.generateInterViewReportController,
);

module.exports = interviewRouter;

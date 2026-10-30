// Work of app.js
// server ka instance create karna
// middlewares and routes ko use karna
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow operations with cookies
  }),
);

/* require all the routes here */
const authRouter = require("./routes/auth.routes.js");
const interviewRouter = require("./routes/interview.routes.js");

/* using all the routes here  */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;

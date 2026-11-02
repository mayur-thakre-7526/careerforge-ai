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

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled application error:", err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: "Resume file must be 3 MB or smaller.",
    });
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request body.",
    });
  }

  return res.status(err.status || 500).json({
    message:
      err.status && err.status < 500 ? err.message : "Internal server error.",
  });
});

module.exports = app;

// Work of app.js
// server ka instance create karna
// middlewares and routes ko use karna

const express = require("express");

const app = express();

app.use(express.json());

/* require all the routes here */
const authRouter = require("./routes/auth.routes.js");
/* using all the routes here  */
app.use("/api/auth", authRouter);

module.exports = app;

const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

dotenv.config({path: "./config.env"});

require("./db/conn");

// const User = require("./model/UserSchema")

app.use(express.json());

app.use(require("./routes/auth"));
const PORT = process.env.PORT;

// // Middle-ware
// const middleware = (req, res, next) => {
//   console.log("Hello middleware");
//   next();
// // };

// app.get("/", (req, res) => {
//   res.send(`Hello World from the server`);
// });

// app.get("/about", middleware, (req, res) => {
//   console.log("Hello my About");
//   res.send(`Hello World from About page of the server`);
// });

// app.get("/about", (req, res) => {
//   res.cookie("Test", "thapa");
//   res.send(`Hello World from Contact page of the server`);
// });

// app.get("/contact", (req, res) => {
//   res.send(`Hello World from Sign-in page of the server`);
// });

app.get("/signup", (req, res) => {
  res.send(`Hello World from Sign-up page of the server`);
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});

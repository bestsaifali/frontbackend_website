const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

require("../db/conn");

const User = require("../model/UserSchema");

router.get("/", (req, res) => {
  res.send("Hello from router Server js");
});

// Register route
router.post("/register", async (req, res) => {
  const {name, email, phone, work, password, cpassword} =
    req.body;
  if (
    !name ||
    !email ||
    !phone ||
    !work ||
    !password ||
    !cpassword
  ) {
    return res
      .status(422)
      .json({error: "Plz fill all the fields properly..."});
  }

  try {
    const userExist = await User.findOne({email: email});
    if (userExist) {
      return res
        .status(422)
        .json({error: "Email already exists"});
    } else if (password != cpassword) {
      return res
        .status(422)
        .json({error: "Password not matching"});
    } else {
      const user = new User({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });

      await user.save();
      res.status(201).json({
        message: "User registered successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Login route
router.post("/signin", async (req, res) => {
  try {
    let token;
    const {email, password} = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({error: "Wrong credentials.."});
    }
    const userLogin = await User.findOne({email: email});
    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(
        password,
        userLogin.password
      );
      if (!isMatch) {
        res
          .status(400)
          .json({error: "Invalid Credientials "});
      } else {
        const token = await userLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        res.json({message: "user Signin Successfully"});
      }
    } else {
      res.json({error: "Invalid credentails"});
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", authenticate, (req, res) => {
  console.log("Hello my About");
  res.send(req.rootUser);
});

router.get("/getdata", authenticate, (req, res) => {
  console.log("Hello my About");
  res.send(req.rootUser);
});

// Contact us Page
router.post("/contact", authenticate, async (req, res) => {
  try {
    const {name, email, phone, message} = req.body;
    if (!name || !email || !phone || !message) {
      console.log("Please fill the contact form..");
      return res.json({
        error: "plzz fill the contact form properly.",
      });
    }
    const userContact = await User.findOne({
      _id: req.userID,
    });
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save();
      res
        .status(201)
        .json({message: "user Contact successfully"});
    }
  } catch (error) {
    console.error();
  }
});

// Logout Page
router.get("/logout", (req, res) => {
  console.log("Logout Page ");
  res.clearCookie("jwttoken", {path: "/"});
  res.status(200).send("User Logout");
});

module.exports = router;

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Hashing the password
userSchema.pre("save", async function (next) {
  // console.log("Hii from inside the function.");
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 12);
    this.cpassword = bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// Generate a token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign(
      {_id: this._id},
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({token: token});
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

// Store the message
userSchema.methods.addMessage = async function (
  name,
  email,
  phone,
  message
) {
  try {
    this.message = this.message.concat({
      name,
      email,
      phone,
      message,
    });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};
const User = mongoose.model("USER", userSchema);
module.exports = User;

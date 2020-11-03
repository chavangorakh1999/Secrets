//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({ email: userName }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(password, hash, function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      } else {
        console.log("No user Found please register");
      }
    } else {
      console.log(err);
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("Sucessfuly started at port " + port);
});

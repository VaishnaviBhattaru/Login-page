require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema =new mongoose.Schema({
  email: String,
  password: String
});



const User= new mongoose.model("User",userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


app.post("/register", function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    newUser= new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if(!err){
        res.render("secrets");
      }else{
        console.log(err);
      }
    });
});
});

app.post("/login",function(req,res){
  const username= req.body.username;
  const password = req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      bcrypt.compare(password, foundUser.password).then(function(result) {
        if(result === true){
          res.render("secrets");
    }
    });
    }
  })
})






app.listen(1500, function() {
  console.log("server 1500 is running");
});

const express = require("express");
const authRouter = express.Router();
const { validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");



authRouter.post("/signup", async (req, res) => {
    try {
    // Validation of data
    validateSignUpData(req);
  
    const {firstName, lastName, emailId, password} = req.body;
  
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
  
      // Creating a new instance of the User model
      const user = new User({
          firstName, 
          lastName, 
          emailId, 
          password: passwordHash,
      });
   
      const savedUser = await user.save();
      const token = await savedUser.getJWT();
  
         //Add a token to cookie and send the response back to the user
          res.cookie("token", token, {
            expires: new Date(Date.now() + 8*3600000),
          });
          res.send(user);
      res.json({message: "User added successfully!", data: savedUser});
   } catch (err) {
      res.status(400).send("ERROR : " + err.message);
   } 
      
  });

authRouter.post("/login", async (req, res) => {
    try {
      
      const {emailId, password} = req.body;
  
      // Checking if emailId is valid 
      const user = await User.findOne({emailId: emailId});
      if (!user) {
          throw new Error("Incorrect email id. Please check!!");
      };
  
      // Checking if the password is valid
      const isPasswordValid = await user.validatePassword(password);
  
      if(isPasswordValid) {
         // Create a JWT Token
        const token = await user.getJWT();
  
         //Add a token to cookie and send the response back to the user
          res.cookie("token", token, {
            expires: new Date(Date.now() + 8*3600000),
          });
          res.send(user);
      } else {
          throw new Error("Incorrect password!!")
      }
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logout Successful!!");
});


module.exports = authRouter;
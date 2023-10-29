"use strict";
const express = require("express"),
  router = express.Router(),
  userRepo = require("../user/user.repository"),
  logger = require("../lib/logger");

router.get("/login", async (req, res, next) => {
  try {
    const password = req.body.password;

    let existingUser = await userRepo.findByEmail(req.body.email);
    if (existingUser) {
      if (password === existingUser.password) {
        res.json({
          message: "Login Successful",
          user: {
            id: existingUser._id,
            email: existingUser.email,
          },
        });
      } else {
        res.send({ message: "Inncorrect Password , Try Again!" });
      }
    } else {
      res.json({ message: "No matching email found" });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    let existingUser = await userRepo.findByEmail(req.body.email);

    if (existingUser) {
      res.json({ message: "User exists" });
    } else {
      //save user
      let savedUser = await userRepo.saveUser(req.body);
      res.json({
        message: "Register Successful",
        user: {
          id: savedUser._id,
          email: savedUser.email,
        },
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;

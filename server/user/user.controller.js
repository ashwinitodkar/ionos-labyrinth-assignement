'use strict';
const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcrypt'),
  userRepo = require('../user/user.repository'),
  userService = require('./user.service'),
  logger = require('../lib/logger');

router.get('/login', async (req, res, next) => {
  try {
    let existingUser = await userRepo.findByEmail(req.body.email);

    if (!existingUser) {
      return res
        .status(global.config.httpStatusCodes.NOT_FOUND.code)
        .json({ message: 'User does not exists' });
    }

    const isValidUser = await userService.comparePassword(
      req.body.password,
      existingUser.hash
    );

    if (!isValidUser) {
      return res
        .status(global.config.httpStatusCodes.UNAUTHORIZED.code)
        .json({ error: 'Authentication failed' });
    }

    res
      .status(global.config.httpStatusCodes.OK.code)
      .json({ message: 'Login Successful' });
  } catch (e) {
    // log error
    next(e);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    let existingUser = await userRepo.findByEmail(req.body.email);

    if (existingUser) {
      res.json({ message: 'User already exists' });
    } else {
      //save user

      const savedUser = await userService.registerUser(
        req.body.email,
        req.body.password
      );

      res.status(global.config.httpStatusCodes.OK.code).json({
        message: 'Register Successful',
        user: {
          id: savedUser._id,
          email: savedUser.email,
        },
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(global.config.httpStatusCodes.INTERNAL_SERVER_ERROR.code)
      .json({ error: 'Registration failed' });
  }
});

module.exports = router;

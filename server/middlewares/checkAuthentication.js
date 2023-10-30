'use strict';
const logger = require('../lib/logger'),
  userService = require('../user/user.service'),
  userRepo = require('../user/user.repository');

module.exports.validateUser = async (req, res, next) => {
  try {
    const authorization = req.get('authorization');
    let user = authorization.split(' ')[1];
    let userBuffer = Buffer.from(user, 'base64');
    let userCredentials = userBuffer.toString('ascii');
    req.user = {
      email: userCredentials.split(':')[0],
      password: userCredentials.split(':')[1],
    };

    let existingUser = await userRepo.findByEmail(req.user.email);

    if (existingUser) {
      const isValidUser = await userService.comparePassword(
        req.user.password,
        existingUser.hash
      );

      if (!isValidUser) {
        throw new Error('Wrong Password');
      }
      req.user.id = existingUser._id;
      //check password
    } else {
      //save user
      let savedUser = await userService.registerUser(
        req.user.email,
        req.user.password
      );
      req.user.id = savedUser._id;
    }
    next();
  } catch (e) {
    logger.error('User not authorised ' + e.stack);
    res
      .status(global.config.httpStatusCodes.UNAUTHORIZED.code)
      .json({ message: global.config.httpStatusCodes.UNAUTHORIZED.message });
  }
};

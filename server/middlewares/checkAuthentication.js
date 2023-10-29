"use strict";
const logger = require("../lib/logger"),
  userRepo = require("../user/user.repository");

module.exports.validateUser = async (req, res, next) => {
  try {
    let authorization = req.get("authorization");
    let user = authorization.split(" ")[1];
    let userBuffer = Buffer.from(user, "base64");
    let userCredentials = userBuffer.toString("ascii");
    req.user = {
      email: userCredentials.split(":")[0],
      password: userCredentials.split(":")[1],
    };

    let existingUser = await userRepo.findByEmail(req.user.email);

    if (existingUser) {
      req.user.id = existingUser._id;
    } else {
      //save user
      let savedUser = await userRepo.saveUser(req.user);
      req.user.id = savedUser._id;
    }
    next();
  } catch (e) {
    logger.error("User not authorised to view this customer " + e.stack);
    res
      .status(global.config.httpStatusCodes.UNAUTHORIZED.code)
      .json(global.config.httpStatusCodes.UNAUTHORIZED.message);
  }
};

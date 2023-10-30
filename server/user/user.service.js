const bcrypt = require('bcrypt'),
  userRepo = require('./user.repository'),
  logger = require('../lib/logger');

module.exports.registerUser = async (email, password) => {
  try {
    //save user
    const hash = await bcrypt.hash(password, global.config.saltRounds);
    let user = { hash: hash, salt: null, email: email }; // Save the salt or null here

    const savedUser = await userRepo.saveUser(user);
    return savedUser;
  } catch (e) {
    logger.error(`Failed to save user ${e}`);
    return null;
  }
};

module.exports.comparePassword = async (password, hash) => {
  try {
    const isValidUser = await bcrypt.compare(password, hash);
    return isValidUser;
  } catch (e) {
    logger.error(`Failed to save user ${e}`);
    return null;
  }
};

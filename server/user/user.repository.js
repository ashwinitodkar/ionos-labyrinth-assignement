const userModel = require("../models/user");


module.exports.findByEmail = (email) => {
    return userModel.findOne({
        email: email
    });
  }
  
  module.exports.saveUser = (user) => {
    let newUser = new userModel(user);
    return newUser.save();
  }
const Mongoose = require("mongoose"),
  Types = Mongoose.Schema.Types;

const modelName = "User";

  const UserSchema = new Mongoose.Schema(
  {
    email: {
      type: Types.String,
      required: true
    },
    password: {
      type: Types.String,
      required: false
    },
    isActive: {
      type: Types.Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const User = module.exports = Mongoose.model(modelName, UserSchema);

module.exports.findByEmail = (email) => {
  return User.findOne({
      email: email
  });
}

module.exports.saveUser = (user) => {
  let newUser = new User(user);
  return newUser.save();
}
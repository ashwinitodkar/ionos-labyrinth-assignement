const Mongoose = require('mongoose'),
  Types = Mongoose.Schema.Types;

const modelName = 'User';

const UserSchema = new Mongoose.Schema(
  {
    email: {
      type: Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Types.String,
      required: false,
    },
    hash: { type: Types.String }, // Store the hashed password
    salt: { type: Types.String }, // Store the salt used for hashing
    isActive: {
      type: Types.Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model(modelName, UserSchema);

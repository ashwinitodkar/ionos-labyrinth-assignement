const Mongoose = require("mongoose"),
  Types = Mongoose.Schema.Types;

/**
 * Labyrinth Schema
 */

const modelName = "Labyrinth";

const labyrinthElementSchema = new Mongoose.Schema({
  x: Number,
  y: Number,
  value: Number, // You can use a different data type if needed
}, { _id : false });

const LabyrinthSchema = new Mongoose.Schema({
  matrix: [[labyrinthElementSchema]],
  userId: { type: Types.ObjectId, ref: "User" },
});

module.exports = Mongoose.model(modelName, LabyrinthSchema);

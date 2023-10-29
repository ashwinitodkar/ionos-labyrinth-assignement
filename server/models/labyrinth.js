const Mongoose = require("mongoose"),
  logger = require("../lib/logger"),
  Types = Mongoose.Schema.Types,
  CellType = {
    empty: 0,
    filled: 1,
    start: 2,
    end: 3,
  };
/**
 * Labyrinth Schema
 */

const modelName = "Labyrinth";

const labyrinthElementSchema = new Mongoose.Schema({
  x: Number,
  y: Number,
  value: Number, // You can use a different data type if needed
});

const LabyrinthSchema = new Mongoose.Schema({
  matrix: [[labyrinthElementSchema]],
  userId: { type: Types.ObjectId, ref: "User" },
});

const Labyrinth = (module.exports = Mongoose.model(modelName, LabyrinthSchema));

module.exports.getUserLabyrinth = (userId) => {
  return Labyrinth.find({
    userId: userId,
  });
};

module.exports.getLabyrinthById = (id) => {
  return Labyrinth.find({
    _id: id,
  });
};

module.exports.createLabyrinthForUser = (userId, rows, columns) => {
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push({ x: i, y: j, value: 0 }); // Set coordinates and initialize with 0 value
    }
    matrix.push(row);
  }

  // Create a new labyrinth document and insert it into the database
  const newLabyrinth = new Labyrinth({ matrix, userId });

  return newLabyrinth.save();
};

//PUT /labyrinth/:id/playfield/:x/:y/:type
module.exports.updateLabyrinthCell = async (id, xCord, yCord, type) => {
  let doc = await Labyrinth.findOne({ _id: id });

  if (doc && doc.matrix) {
    doc.matrix[xCord][yCord].value = Number.parseInt(CellType[type]);
    // Save the updated document
    return doc.save();
  }
};

//PUT /labyrinth/:id/start/:x/:y/
module.exports.setLabyrinthStart = async (id, xCord, yCord) => {
  let doc = await Labyrinth.findOne({ _id: id });

  if (doc && doc.matrix) {
    doc.matrix[xCord][yCord].value = Number.parseInt(CellType.start);
    // Save the updated document
    return doc.save();
  }
};

//PUT /labyrinth/:id/end/:x/:y/
module.exports.setLabyrinthEnd = async (id, xCord, yCord) => {
  let doc = await Labyrinth.findOne({ _id: id });

  if (doc && doc.matrix) {
    doc.matrix[xCord][yCord].value = Number.parseInt(CellType.end);
    // Save the updated document
    return doc.save();
  }
};

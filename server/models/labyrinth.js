const Mongoose = require("mongoose"),
logger = require('../lib/logger'),
  Types = Mongoose.Schema.Types;

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

module.exports.getLabyrinth = (userId) => {
  return Labyrinth.find({
    userId: userId,
  });
};

module.exports.getLabyrinth = (id, userId) => {
  return Labyrinth.find({
    userId: userId,
    _id: id,
  });
};

module.exports.createLabyrinthForUser = (userId) => {
  const n = 4,
    m = 7; // Replace with your desired matrix size (e.g., 4x7)
  const matrix = [];

  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < m; j++) {
      row.push({ x: i, y: j, value: 0 }); // Set coordinates and initialize with 0 value
    }
    matrix.push(row);
  }

  // Create a new labyrinth document and insert it into the database
  const newLabyrinth = new Labyrinth({ matrix, userId });

  return Labyrinth.save(newLabyrinth);
};

// Retrieve and update matrix element
const x = 1;
const y = 2;
const newValue = 42;

//PUT /labyrinth/:id/playfield/:x/:y/:type
module.exports.updateLabyrinthCell = (id, xCord, yCord, type) => {
    return Labyrinth.findOne({id})
    .then((doc) => {
      if (doc && doc.matrix) {
        // Update the value at coordinates (x, y)
        doc.matrix[xCord][yCord].value = type;

        // Save the updated document
        return doc.save();
      } else {
        logger.info("Labyrinth not found.");
      }
    })
};

//PUT /labyrinth/:id/playfield/:x/:y/:type
module.exports.setLabyrinthStart = (id, xCord, yCord) => {
    return Labyrinth.findOne({id})
    .then((doc) => {
      if (doc && doc.matrix) {
        // Update the value at coordinates (x, y)
        doc.matrix[xCord][yCord].value = 10;

        // Save the updated document
        return doc.save();
      } else {
        logger.info("Labyrinth not found.");
      }
    })
};


//PUT /labyrinth/:id/playfield/:x/:y/:type
module.exports.setLabyrinthDestination = (id, xCord, yCord) => {
    return Labyrinth.findOne({id})
    .then((doc) => {
      if (doc && doc.matrix) {
        // Update the value at coordinates (x, y)
        doc.matrix[xCord][yCord].value = 11;

        // Save the updated document
        return doc.save();
      } else {
        console.log("Matrix document not found.");
      }
    })
};
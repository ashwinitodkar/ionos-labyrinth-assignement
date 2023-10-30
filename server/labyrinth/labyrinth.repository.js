const labyrinthModel = require('../models/labyrinth'),
  labyrinthUtils = require('./labyrinth.utils'),
  labyrinthConfig = require('../../config/labyrinthConfig');

module.exports.getUserLabyrinth = (userId) => {
  return labyrinthModel.find({
    userId: userId,
  });
};

module.exports.getLabyrinthById = (id) => {
  return labyrinthModel.findById(id);
};

module.exports.getUserLabyrinthById = (id, userId) => {
  return labyrinthModel.findOne({ _id: id, userId: userId });
};

module.exports.createEmptyLabyrinthForUser = (userId, rows, columns) => {
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      // Set coordinates and initialize with 0 value
      row.push({ x: i, y: j, value: 0 });
    }
    matrix.push(row);
  }

  // Create a new labyrinth document and insert it into the database
  const newLabyrinth = new labyrinthModel({ matrix, userId });

  return newLabyrinth.save();
};

//PUT /labyrinth/:id/playfield/:x/:y/:type
module.exports.updateLabyrinthCell = async (id, xCord, yCord, type) => {
  let doc = await labyrinthModel.findById(id);

  if (!doc?.matrix) return null;

  doc.matrix[xCord][yCord].value = labyrinthConfig.cellValues[type.trim()];
  // Save the updated document
  return doc.save();
};

//PUT /labyrinth/:id/start/:x/:y/
module.exports.setLabyrinthStart = async (id, xCord, yCord) => {
  let doc = await labyrinthModel.findById(id);

  if (
    !doc?.matrix ||
    !labyrinthUtils.isValidCoordinates(doc.matrix, xCord, yCord)
  ) {
    return null;
  }
  // update existing start
  const coordinates = labyrinthUtils.findCoordinates(
    doc.matrix,
    labyrinthConfig.cellValues.start
  );

  if (coordinates !== null) {
    doc.matrix[coordinates.x][coordinates.y].value =
      labyrinthConfig.cellValues.empty;
  }

  doc.matrix[xCord][yCord].value = Number.parseInt(
    labyrinthConfig.cellValues.start
  );
  // Save the updated document
  return doc.save();
};

//PUT /labyrinth/:id/end/:x/:y/
module.exports.setLabyrinthEnd = async (id, xCord, yCord) => {
  let doc = await labyrinthModel.findOne({ _id: id });

  if (
    !doc?.matrix ||
    !labyrinthUtils.isValidCoordinates(doc.matrix, xCord, yCord)
  ) {
    return null;
  }
  // update existing start
  const coordinates = labyrinthUtils.findCoordinates(
    doc.matrix,
    labyrinthConfig.cellValues.end
  );

  if (coordinates !== null) {
    doc.matrix[coordinates.x][coordinates.y].value =
      labyrinthConfig.cellValues.empty;
  }

  doc.matrix[xCord][yCord].value = labyrinthConfig.cellValues.end;
  // Save the updated document
  return doc.save();
};

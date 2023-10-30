module.exports.findCoordinates = function (matrix, targetValue) {
  let foundCell = null;

  matrix.find((row) => {
    foundCell = row.find((cell) => cell.value === targetValue);
    return foundCell !== undefined;
  });

  if (foundCell) {
    return { x: foundCell.x, y: foundCell.y };
  } else {
    return null; // Element not found
  }
};

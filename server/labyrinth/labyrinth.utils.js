const labyrinthConfig = require("../../config/labyrinthConfig"),
  logger = require("../lib/logger");

module.exports.solveLabyrinthBFS = function (labyrinth) {
  try {
    const rows = labyrinth.length;
    const cols = labyrinth[0].length;

    let directionPath = null;

    if (!isValidLabyrinth(labyrinth)) {
      return { path: directionPath, message: "Invalid labyrinth input" };
    }

    if (!areLabyrinthDimensionsValid(labyrinth)) {
      return {
        path: directionPath,
        message: "Labyrinth must have at least 2 rows and 2 columns.",
      };
    }

    const { startX, startY, endX, endY } = findStartAndEndPoints(labyrinth);

    // Create a queue for BFS, each element contains the x, y coordinates and the path to it.
    const queue = [{ x: startX, y: startY, path: [] }];

    // Create a visited matrix to keep track of visited cells.
    const visited = new Array(rows)
      .fill(false)
      .map(() => new Array(cols).fill(false));

    while (queue.length > 0) {
      const { x, y, path } = queue.shift();

      // Mark the current cell as visited.
      visited[x][y] = true;

      // Add the current cell to the path.
      path.push([x, y]);

      // Check if we've reached the destination.
      if (x === endX && y === endY) {
        directionPath = path.map((coord, index) => {
          if (index === 0) return "";

          const [prevX, prevY] = path[index - 1];
          const [currentX, currentY] = coord;
          const dx = currentX - prevX;
          const dy = currentY - prevY;

          if (dx === 1) return "down";
          if (dx === -1) return "up";
          if (dy === 1) return "right";
          if (dy === -1) return "left";
        });

        logger.info(directionPath.join(" "));
        return { path: directionPath, message: "Solution Found" };
      }

      // Explore all four possible directions.
      for (const [dx, dy] of labyrinthConfig.directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newX < rows &&
          newY >= 0 &&
          newY < cols &&
          labyrinth[newX][newY] === labyrinthConfig.cellValues.empty &&
          !visited[newX][newY]
        ) {
          // Add the neighbor to the queue with the updated path.
          queue.push({ x: newX, y: newY, path: path.slice() });
        }
      }
    }
    return { path: directionPath, message: "Solution Not Found" };
  } catch (e) {
    logger.error(`Error solving labyrinth ${e.error} ${e.stack}`);
    return { path: directionPath, message: "Error" };
  }
};

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

module.exports.isValidCoordinates = function (matrix, x, y) {
    // Check if x and y are within the bounds of the matrix
    return x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length;
};


function findStartAndEndPoints(labyrinth) {
  let startX = null;
  let startY = null;
  let endX = null;
  let endY = null;
  const rows = labyrinth.length;
  const cols = labyrinth[0].length;

  // Find the start and destination points in the labyrinth.
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (labyrinth[i][j] === labyrinthConfig.cellValues.start) {
        startX = i;
        startY = j;
        labyrinth[i][j] = 0;
      } else if (labyrinth[i][j] === labyrinthConfig.cellValues.end) {
        endX = i;
        endY = j;
        labyrinth[i][j] = 0;
      }
    }
  }

  return { startX, startY, endX, endY };
}

function isValidLabyrinth(labyrinth) {
  return Array.isArray(labyrinth) && labyrinth.length > 0;
}

function areLabyrinthDimensionsValid(labyrinth) {
  const rows = labyrinth.length;
  const cols = labyrinth[0].length;
  return rows >= 2 && cols >= 2;
}

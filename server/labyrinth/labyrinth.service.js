const cellValues = require("../../config/labyrinthConfig"),
logger = require("../lib/logger");

module.exports.solveLabyrinthBFS = function (labyrinth) {
  try {
    const rows = labyrinth.length;
    const cols = labyrinth[0].length;
    let directionPath = null;

    // Define directions for moving up, down, left, and right.
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    let startX = null;
    let startY = null;
    let endX = null;
    let endY = null;

    // Find the start and destination points in the labyrinth.
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (labyrinth[i][j] === cellValues.start) {
          startX = i;
          startY = j;
          labyrinth[i][j] = 0;
        } else if (labyrinth[i][j] === cellValues.end) {
          endX = i;
          endY = j;
          labyrinth[i][j] = 0;
        }
      }
    }

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
        console.log("Solution found:");
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

        console.log(directionPath.join(" "));
        return directionPath;
      }

      // Explore all four possible directions.
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newX < rows &&
          newY >= 0 &&
          newY < cols &&
          labyrinth[newX][newY] === cellValues.empty &&
          !visited[newX][newY]
        ) {
          // Add the neighbor to the queue with the updated path.
          queue.push({ x: newX, y: newY, path: path.slice() });
        }
      }
    }
    return directionPath;
  } catch (e) {
    logger.error(`Error solving labyrinth ${e.error} ${e.stack}`);
    return null;
  }
};

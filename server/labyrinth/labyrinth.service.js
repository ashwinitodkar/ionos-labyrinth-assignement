const labyrinthRepo = require("../labyrinth/labyrinth.repository"),
  labyrinthUtils = require("../labyrinth/labyrinth.utils"),
  logger = require("../lib/logger");

module.exports.getLabyrinthSolution = async (id) => {
  try {
    let labyrinthObj = await labyrinthRepo.getLabyrinthById(id);

    //retrieve simple 2D array
    console.log(JSON.stringify(labyrinthObj.matrix));
    let labyrinthArray = labyrinthObj.matrix.map((row) =>
      row.map((cell) => cell.value)
    );

    logger.info("Retrieved simple 2D array:");
    console.log(labyrinthArray);

    let solution = labyrinthUtils.solveLabyrinthBFS(labyrinthArray);
    logger.info(`path - ${solution.path}`);
    return solution;
  } catch (e) {
    logger.error(`Error solving labyrinth ${e.error} ${e.stack}`)
    return null;
  }
};

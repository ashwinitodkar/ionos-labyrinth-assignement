"use strict";
const express = require("express"),
  router = express.Router(),
  logger = require("../lib/logger"),
  checkAuthentication = require("../middlewares/checkAuthentication"),
  labyrinthRepo = require("../labyrinth/labyrinth.repository"),
  solveLabyrinth = require("./labyrinth.service");

// create labyrinth

router.post("/", checkAuthentication.validateUser, async (req, res, next) => {
  try {
    //create labyeinth for user
    const n = 4,
      m = 7;
    let labyrinthObj = await labyrinthRepo.createLabyrinthForUser(
      req.user.id,
      n,
      m
    );
    return res.status(global.config.httpStatusCodes.CREATED.code).json({
      message: global.config.httpStatusCodes.CREATED.message,
      id: labyrinthObj._id,
    });
  } catch (e) {
    next(e);
  }
});

// get all labyrinths of a user

router.get("/", checkAuthentication.validateUser, async (req, res, next) => {
  try {
    let labyrinthList = await labyrinthRepo.getUserLabyrinth(req.user.id);
    return res
      .status(global.config.httpStatusCodes.OK.code)
      .json(labyrinthList);
  } catch (error) {
    next(error);
  }
});

// get labyrinths of a user by id

router.get("/:id", checkAuthentication.validateUser, async (req, res, next) => {
  try {
    let labyrinthObj = await labyrinthRepo.getLabyrinthById(req.params.id);
    return res.status(global.config.httpStatusCodes.OK.code).json(labyrinthObj);
  } catch (error) {
    next(error);
  }
});

// get labyrinth of a user by id

// update x, y co-ordinate of labyrinth to empty/filled (0/1)
// PUT /labyrinth/:id/playfield/:x/:y/:type

router.put(
  "/:id/playfield/:x/:y/:type",
  checkAuthentication.validateUser,
  async (req, res, next) => {
    try {
      let params = req.params;

      let updatedLabyrinth = await labyrinthRepo.updateLabyrinthCell(
        params.id,
        params.x,
        params.y,
        params.type
      );

      return res.status(global.config.httpStatusCodes.OK.code).json({
        message: global.config.httpStatusCodes.OK.message,
        id: updatedLabyrinth._id,
      });
    } catch (e) {
      next(e);
    }
  }
);

// update start point of labywrinth
router.put(
  "/:id/start/:x/:y",
  checkAuthentication.validateUser,
  async (req, res, next) => {
    try {
      let params = req.params;

      let updatedLabyrinth = await labyrinthRepo.setLabyrinthStart(
        params.id,
        params.x,
        params.y
      );

      return res.status(global.config.httpStatusCodes.OK.code).json({
        message: global.config.httpStatusCodes.OK.message,
        id: updatedLabyrinth._id,
      });
    } catch (e) {
      next(e);
    }
  }
);

// update destination point of labywrinth
router.put(
  "/:id/end/:x/:y",
  checkAuthentication.validateUser,
  async (req, res, next) => {
    try {
      let params = req.params;

      let updatedLabyrinth = await labyrinthRepo.setLabyrinthEnd(
        params.id,
        params.x,
        params.y
      );

      return res.status(global.config.httpStatusCodes.OK.code).json({
        message: global.config.httpStatusCodes.OK.message,
        id: updatedLabyrinth._id,
      });
    } catch (e) {
      next(e);
    }
  }
);

// get solution of labyrinth by id

router.get(
  "/:id/solution",
  checkAuthentication.validateUser,
  async (req, res, next) => {
    try {
      let labyrinthObj = await labyrinthRepo.getLabyrinthById(req.params.id);

      //retrieve simple 2D array
      console.log(JSON.stringify(labyrinthObj.matrix));
      let labyrinthArray = labyrinthObj.matrix.map((row) =>
        row.map((cell) => cell.value)
      );

      logger.info("Retrieved simple 2D array:");
      console.log(labyrinthArray);

      let directionPath = solveLabyrinth.solveLabyrinthBFS(labyrinthArray);
      logger.info(`path - ${directionPath}`);

      if (directionPath) {
        return res
          .status(global.config.httpStatusCodes.OK.code)
          .json({ message: "Solution found", path: directionPath });
      }
      return res
        .status(global.config.httpStatusCodes.OK.code)
        .json({ message: "No solution found" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

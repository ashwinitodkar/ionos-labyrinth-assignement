'use strict';
const express = require('express'),
  router = express.Router(),
  logger = require('../lib/logger'),
  labyrinthConfig = require('../../config/labyrinthConfig'),
  labyrinthRepo = require('../labyrinth/labyrinth.repository'),
  labyrinthBL = require('../labyrinth/labyrinth.service');
// create labyrinth

// checkAuthentication.validateUser is used for all routes, we can move it to the at a main route level where this route is imported
router.post('/', async (req, res, next) => {
  try {
    //create labyrinth for user
    let labyrinthObj = await labyrinthRepo.createEmptyLabyrinthForUser(
      req.user.id,
      labyrinthConfig.numberOfRows,
      labyrinthConfig.numberOfColumns
    );

    // return not needed here
    res.status(global.config.httpStatusCodes.CREATED.code).json({
      message: global.config.httpStatusCodes.CREATED.message,
      id: labyrinthObj._id,
    });
  } catch (e) {
    //log the error info
    logger.error('Error in create labyrinth matrix route', {
      error: e,
      userId: user.id,
    });
    next(e);
  }
});

// get all labyrinths of a user

router.get('/', async (req, res, next) => {
  try {
    const labyrinthList = await labyrinthRepo.getUserLabyrinth(req.user.id);
    res.status(global.config.httpStatusCodes.OK.code).json(labyrinthList);
  } catch (e) {
    logger.error('Error in get labyrinth route', {
      error: e,
      userId: user.id,
    });
    next(e);
  }
});

// get labyrinths of a user by id
// log error and
router.get('/:id', async (req, res, next) => {
  try {
    const labyrinthObj = await labyrinthRepo.getUserLabyrinthById(
      req.params.id,
      req.user.id
    );
    if (!labyrinthObj) {
      return res
        .status(global.config.httpStatusCodes.NOT_FOUND.code)
        .json({ message: global.config.httpStatusCodes.NOT_FOUND.message });
    }
    res.status(global.config.httpStatusCodes.OK.code).json(labyrinthObj);
  } catch (e) {
    logger.error('Error in get labyrinth by id route', {
      error: e,
      userId: req.params.id,
    });
    next(e);
  }
});

// get labyrinth of a user by id

// update x, y co-ordinate of labyrinth to empty/filled (0/1)
// PUT /labyrinth/:id/playfield/:x/:y/:type

router.put('/:id/playfield/:x/:y/:type', async (req, res, next) => {
  try {
    let params = req.params;

    let updatedLabyrinth = await labyrinthRepo.updateLabyrinthCell(
      params.id,
      params.x,
      params.y,
      params.type
    );

    res.status(global.config.httpStatusCodes.OK.code).json({
      message: global.config.httpStatusCodes.OK.message,
      id: updatedLabyrinth._id,
    });
  } catch (e) {
    // log error
    next(e);
  }
});

// update start point of labywrinth
router.put('/:id/start/:x/:y', async (req, res, next) => {
  try {
    let params = req.params;

    let updatedLabyrinth = await labyrinthRepo.setLabyrinthStart(
      params.id,
      params.x,
      params.y
    );

    if (updatedLabyrinth) {
      return res.status(global.config.httpStatusCodes.OK.code).json({
        message: global.config.httpStatusCodes.OK.message,
        id: updatedLabyrinth._id,
      });
    }

    // instead should be an error saying no record updated
    res.status(global.config.httpStatusCodes.BAD_REQUEST.code).json({
      message: global.config.httpStatusCodes.BAD_REQUEST.message,
      id: params.id,
    });
  } catch (e) {
    // log error
    next(e);
  }
});

// update destination point of labywrinth
router.put('/:id/end/:x/:y', async (req, res, next) => {
  try {
    let params = req.params;

    let updatedLabyrinth = await labyrinthRepo.setLabyrinthEnd(
      params.id,
      params.x,
      params.y
    );

    if (updatedLabyrinth) {
      return res.status(global.config.httpStatusCodes.OK.code).json({
        message: global.config.httpStatusCodes.OK.message,
        id: updatedLabyrinth._id,
      });
    }

    // may be
    res.status(global.config.httpStatusCodes.BAD_REQUEST.code).json({
      message: global.config.httpStatusCodes.BAD_REQUEST.message,
      id: params.id,
    });
  } catch (e) {
    // log error
    next(e);
  }
});

// get solution of labyrinth by id

router.get('/:id/solution', async (req, res, next) => {
  try {
    let solution = await labyrinthBL.getLabyrinthSolution(req.params.id);
    logger.info(`path - ${solution.path}, ${solution.message}`);

    if (solution.path) {
      return res.status(global.config.httpStatusCodes.OK.code).json(solution);
    }
    // should be something like 404? below line is same as above
    res.status(global.config.httpStatusCodes.OK.code).json(solution);
  } catch (e) {
    // log error
    next(e);
  }
});

module.exports = router;

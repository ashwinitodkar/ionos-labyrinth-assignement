"use strict";
const express = require("express"),
  router = express.Router(),
  logger = require("../lib/logger");

// create labyrinth

router.post(
  "/",
  (req, res, next) => {
    try {
        return res.json({
          data: {},
          responseCode: 200,
        });
      } catch (error) {
        next(error);
      }
  }
);

// get all labyrinths of a user

router.get("/", async (req, res, next) => {
  try {
    return res.json({
      data: {},
      responseCode: 200,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// get labyrinth of a user by id

// update x, y co-ordinate of labyrinth to empty/filled (0/1)

// update start point of labywrinth

// update destination point of labywrinth

// get solution of labyrinth by id

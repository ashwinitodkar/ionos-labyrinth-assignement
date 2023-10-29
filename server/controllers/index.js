'use strict';
const express = require('express'),
  router = express.Router();

router.use('/api/user', require('../user/user.controller'));
router.use('/api/labyrinth', require('../labyrinth/labyrinth.controller'));

module.exports = router;

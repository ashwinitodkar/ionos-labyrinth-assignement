'use strict';
const express = require('express'),
  router = express.Router();

router.use('/api/user', require('./user'));
router.use('api/labyrinth', require('./labyrinth'));

module.exports = router;

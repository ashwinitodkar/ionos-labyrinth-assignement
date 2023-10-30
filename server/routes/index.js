'use strict';
const express = require('express'),
  router = express.Router();
const checkAuthentication = require('../middlewares/checkAuthentication');

router.use('/api/user', require('../user/user.controller'));
router.use(
  '/api/labyrinth',
  checkAuthentication.validateUser,
  require('../labyrinth/labyrinth.controller')
);

module.exports = router;

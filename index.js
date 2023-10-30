/* jshint node: true */
/* jshint esnext: true */
'use strict';
const express = require('express'),
app = express(),
httpProtocol = require("http"),
fs = require('fs'),
logger = require('./server/lib/logger'),
bodyParser = require('body-parser'),
mongoose = require('./server/lib/mongoose');

global.config = require('./config');

// move this to helper files
mongoose.connect(() => {
    mongoose.loadModels(() => {
      logger.info('loaded all models');
    })
})

/**
* Initialize post data parsing.
**/
app.use(bodyParser.json());

app.use(require('./server/routes'));

/**
* Default handler for invalid API endpoint.
**/
app.all('*', (req, res) => {    
    res.status(global.config.httpStatusCodes.NOT_FOUND.code).json({message: global.config.httpStatusCodes.NOT_FOUND.message});
});

/**
* Default handler for uncaught exception error.
**/
app.use((err, req, res, next) => {
    logger.error("UncaughtException is encountered" +  "\nError=" + err + "\nStacktrace=" + err.stack);
    res.status(global.config.httpStatusCodes.INTERNAL_SERVER_ERROR.code).json({message: global.config.httpStatusCodes.INTERNAL_SERVER_ERROR.message});
});

let httpServer = httpProtocol.createServer(app);
httpServer.listen(global.config.appPort, () => {
    logger.info(`Server started on ${global.config.environmentName} server started at port ${global.config.appPort}`);
});

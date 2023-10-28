"use strict";

/**
 * Module dependencies.
 */
const mongoose = require("mongoose"),
  fs = require("fs"),
  logger = require("./logger");

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Get all the files found in the current directory
  const dirName = process.cwd() + "/server/models";
  const files = fs.readdirSync(dirName);
  // Globbing model files
  files.forEach(function (modelPath) {
    let path = dirName + "/" + modelPath;
    require(path);
  });
  callback();
};

// Initialize Mongoose
module.exports.connect = function (callback) {
  mongoose.Promise = config.Promise;
  console.log(config);
  mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.Promise = Promise;

  let db = mongoose.connection;
  db.on("error", function (error) {
    logger.error(`Error in mongo connection- ${error}`);
  });

  db.on("connected", function () {
    return callback();
  });
};

module.exports.disconnect = function (cb) {
  mongoose.connection.db.close(function (err) {
    logger.info("Disconnected from MongoDB.");
  });
};

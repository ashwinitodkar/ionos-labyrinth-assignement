const Dotenv = require('dotenv');

let envPath = `./.${process.env.APP_ENV}.env`;

Dotenv.config({ path: envPath, silent: true });

const envConfig = require('./envConfig'),
  apiConfig = require('./apiConfig');

module.exports = Object.assign({}, envConfig, {httpStatusCodes: JSON.parse(JSON.stringify(apiConfig))}) || {};

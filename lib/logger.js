const debug = require('debug');
const Package = require('../package.json');
const APP_NAME = Package.name;

const info = debug(`${APP_NAME}:info`);
const error = debug(`${APP_NAME}:error`);
const warn = debug(`${APP_NAME}:warn`);

module.exports = {
  info,
  warn,
  error
};


/**
 * Entry Script
 */

//TODO: Manage entry per Environment

// DEVELOP
// Babel polyfill to convert ES6 code in runtime
require('babel-register')({
  "plugins": [
    [
      "babel-plugin-webpack-loaders",
      {
        "config": "./config/webpack.config.babel.js",
        "verbose": true
      }
    ]
  ]
});
require('babel-polyfill');
require('./server/index.js');


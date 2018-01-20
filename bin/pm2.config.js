/* eslint-disable */
const path = require('path');
const Package = require('../package.json');

module.exports = {
  apps: [
    {
      name: Package.name,
      cwd: path.resolve(__dirname, '../'),
      script: './bin/www',
      watch: false,
      instances: 1,
      interpreter: 'node',
      interpreter_args: '--harmony',
      exec_mode: 'fork',
      env: {
        "NODE_ENV": "development",
        "DEBUG": Package.name + ":*"
      },
      env_production: {
        "NODE_ENV": "production"
      }
    }
  ]
};

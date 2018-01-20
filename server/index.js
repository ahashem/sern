import express from 'express';
import chalk from 'chalk';

const config = require('../config/project.config');

// Initialize the Express application
const app = express();

(async function run() {

  // Express
  await require('../lib/express').index(app);

  // Initial client routes setup
  await require('../lib/express/client').default(app);

  // Server
  app.listen(config.server_port, (error) => {
    if (!error) {
      console.log(chalk.magenta(`-------\nSERN Server-> 
          Environment: [${chalk.magentaBright(`${config.env}`)}]
          URL: ${chalk.blueBright(`http://${config.server_uri}:${config.server_port}`)}\n-------`));

      // Ready!
      console.log(chalk.black.bgGreenBright(`>>Server Ready!<<`));
    }
  });

})();

export default app;

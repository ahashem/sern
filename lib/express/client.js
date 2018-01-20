import fs from "fs";
import express from 'express';
import config from '../../config/project.config';

export default (app) => {

  // Paths 404 from url
  app.get(config.forbidden_paths, (req, res) => {
    res.status(404).send('404! Not Found'); // TODO: add 404 page
  });

  // Point static path to client by default
  let client = `${config.basePath}/${config.srcDir}`;
  let file = config.main;

  // If not exits client, when set internal default
  if (!fs.existsSync(client)) {
    //  TODO: Add fallback if client folder not loaded
  }

  app.use(express.static(client));
  // app.use(favicon(path.join(client, 'favicon.ico')));

  // Temporary - TODO: remove and manage other paths
  app.get('/', (req, res, next) => {
    res.set('content-type', 'text/html');
    res.send('HELLO, SERN!');
    res.end();
  });

  // client routing
  app.get('/*', (req, res) => {
    res.sendFile(`${client}/${file}.html`);
  });


}

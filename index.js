const express = require('express');
const path = require('path');
const compress = require('compression');
const fs = require('fs');
const bodyParser = require('body-parser');
const CORS = require('connect-cors');
const morganLogger = require('morgan');
const config = require('./project.config');

// Initialize the Express application
const app = express();
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// logging
app.use(morganLogger('dev'));

// ------------------------------------
// Environment Configuration
// ------------------------------------
const __DEV__ = config.env === 'development';

// ------------------------------------
// CORS Configuration
// ------------------------------------
const corsConfig = {
  headers: ['Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
  methods: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE'],
};
app.use(CORS(corsConfig));

app.get('/', (req, res, next) => {
  res.set('content-type', 'text/html');
  res.send('HELLO, SERN!');
  res.end();
});

module.exports = app;

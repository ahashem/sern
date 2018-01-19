const express = require('express');
const path = require('path');
const compress = require('compression');
const fs = require('fs');
const bodyParser = require('body-parser');
const CORS = require('connect-cors');
const morganLogger = require('morgan');
const project = require('./project.config');

// Initialize the Express application
const app = express();
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// logging
app.use(morganLogger('dev'));

const PORT = process.env.PORT || 8000;

// ------------------------------------
// Environment Configuration
// ------------------------------------
const __DEV__ = project.env === 'development';

// ------------------------------------
// CORS Configuration
// ------------------------------------
const corsConfig = {
  headers: ['Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
  methods: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE'],
};
app.use(CORS(corsConfig));

module.exports = app;

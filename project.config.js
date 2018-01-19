const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  /** The environment to use when building the project */
  env: NODE_ENV,
  /** The full path to the project's root directory */
  basePath: __dirname,
  /** Server URI (example: localhost) */
  server_uri: 'localhost',
  /** Server port number */
  server_port: 8000,
};

/* global describe, it */

const http = require('http');
const assert = require('assert');
const config = require('../project.config');

describe('Node/Express Server', () => {

  const host = `http://${config.server_uri}:${config.server_port}`;

  it('Server should be online: host should return status 200', done => {
    http.get(host, res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });

});

/* global describe, it, before, after */
// Add promise support if this does not exist natively.
if (!global.Promise) {
  global.Promise = require('q');
}

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const {assert, expect, request, should} = chai;
// const config = require('../project.config');
const server = require('../index');
chai.use(chaiHttp);
chai.use(chaiThings);


describe('Node/Express Server', () => {
  const app = chai.request(server);
  // const host = `http://${config.server_uri}:${config.server_port}`;

  before(done => {
    // Additional `app` configurations before all Tests
    done();
  });

  it('Server should be online: host should return status 200', done => {
    app
      .get('/')
      .then(res => {
        expect(res).to.have.status(200);
        done();
      })
      .catch((err) => {
        throw err;
      });
  });

});

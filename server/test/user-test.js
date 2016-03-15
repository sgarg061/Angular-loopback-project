'use strict';
var common = require('./common');
var app = require('../server');
var authService = require('../services/authService');

var reseller = 'reseller';
var resellerId = reseller;
var cloud = 'cloud';
var cloudId = cloud;

describe('User tests', () => {

  before((done) => {
    // create users to play with.
    app.models.Reseller.find({}, (err, res) => {
      var r = res[0];
      resellerId = r.id;

      common.login('solink', () => {
        authService.createUser(reseller, 'test', {
          userType: 'reseller',
          resellerId: resellerId
        }, () => {
          authService.createUser(cloud, 'test', {
            userType: 'cloud',
            cloudId: cloudId
          }, () => {
            done();
          });
        });
      });
    });
  });

  describe('Update metadata tests', () => {

  });

  describe('Delete tests', () => {

  });

  describe('Force set password tests', () => {

  });

  describe('Create user tests', () => {
    it('should not allow resellers to create cloud users', (done) => {
      common.login({username: reseller, password: 'test'}, (token) => {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'dodo@dood.com',
          password: 'asfd',
          userType: 'cloud',
          orgId: resellerId
        })
        .expect(401)
        .end((err) => {
          if (err) throw err;
          done();
        });
      });
    });

    it('should not allow resellers to create solink users', (done) => {
      common.login({username: reseller, password: 'test'}, (token) => {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'asdf@asdf.com',
          password: 'asdf',
          userType: 'solink',
          orgId: '1'
        })
        .expect(401)
        .end((err) => {
          if (err) throw err;
          done();
        });
      });
    });

    it('should not allow resellers to create other resellers', (done) => {
      common.login({username: reseller, password: 'test'}, (token) => {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'asdf@asdf.com',
          password: 'asdf',
          userType: 'reseller',
          orgId: 'asfd'
        })
        .expect(401)
        .end((err) => {
          if (err) throw err;
          done();
        });
      });
    });

    it('should not allow resellers to create users for customers they do not own', (done) => {
      common.login({username: reseller, password: 'test'}, (token) => {
        common.json('post', '/api/auth/createUser', token)
        .send({
          email: 'asdf@asdf.com',
          password: 'asdf',
          userType: 'admin',
          orgId: 'asdzzzzf'
        })
        .expect(401)
        .end((err) => {
          if (err) throw err;
          done();
        });
      });
    });
  });
});
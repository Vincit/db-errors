'use strict';

const os = require('os');
const path = require('path');
const expect = require('expect.js');
const Promise = require('bluebird');

const TestSession = require('../testUtils').TestSession;
const wrapError = require('../').wrapError;

const UniqueViolationError = require('../').UniqueViolationError;
const ConstraintViolationError = require('../').ConstraintViolationError;

describe('tests', () => {

  const testDatabaseConfigs = [{
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: path.join(os.tmpdir(), 'db_errors_test.db')
    }
  }, {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'db_errors',
      database: 'db_errors_test'
    }
  }, {
    client: 'postgres',
    connection: {
      host: '127.0.0.1',
      user: 'db_errors',
      database: 'db_errors_test'
    }
  }];

  testDatabaseConfigs.forEach(knexConfig => {

    const session = new TestSession({
      knexConfig
    });

    describe(knexConfig.client, () => {

      require('./UniqueViolationError')(session);

    });
  });

});
